package com.lecom.workflow.robo.satelite.generico;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.lecom.tecnologia.db.DBUtils;
import com.lecom.workflow.cadastros.common.util.Funcoes;
import com.lecom.workflow.cadastros.rotas.AprovaProcesso;
import com.lecom.workflow.cadastros.rotas.LoginAutenticacao;
import com.lecom.workflow.cadastros.rotas.exception.LoginAuthenticationException;
import com.lecom.workflow.cadastros.rotas.util.DadosLogin;
import com.lecom.workflow.cadastros.rotas.util.DadosProcesso;
import com.lecom.workflow.cadastros.rotas.util.DadosProcessoAbertura;
import com.lecom.workflow.robo.face.WebServices;
import com.lecom.workflow.robo.face.WebServicesVO;

import br.com.lecom.api.exception.ArquivoNaoEncontratoException;
import br.com.lecom.api.exception.CodigoArquivoInvalidoException;
import br.com.lecom.api.exception.DocumentoException;
import br.com.lecom.api.exception.ProfileException;
import br.com.lecom.api.factory.ECMFactory;
import br.com.lecom.atos.servicos.annotation.Execution;
import br.com.lecom.atos.servicos.annotation.RobotModule;
import br.com.lecom.atos.servicos.annotation.Version;

@RobotModule("RoboImportarPlanilha")
@Version({1,0,8})
public class RoboImportarPlanilha implements WebServices{
	
	private static final Logger logger = Logger.getLogger(RoboImportarPlanilha.class);
	private static String configpath = Funcoes.getWFRootDir() + File.separator + "upload" + File.separator + "cadastros" + File.separator + "config" + File.separator;
	Map<String, String> parametros = null;
	
	@Execution
	public void executar() {
		logger.info("[[INICIO DO ROBO IMPORTADOR DE PLANILHA]]");
		
		try(Connection conAux= DBUtils.getConnection("aux_act")){
			
			parametros = Funcoes.getParametrosIntegracao(configpath + getClass().getSimpleName());

			Calendar dataAtual = Calendar.getInstance();
			String horaAtual = Integer.toString(dataAtual.get(Calendar.HOUR_OF_DAY));
			
			String horasExecucao = parametros.get("horasExecucao");
			
			boolean executarRobo = Arrays.asList(horasExecucao.split(";")).contains(horaAtual);
			
			if (!executarRobo && !horasExecucao.equals("0")) {
				logger.info("[ ===== ROTINAS NÃO DEVEM SER EXECUTADAS AGORA ===== ]");
			} else {
				processarPlanilha(conAux);
			}
		} catch (SQLException e) {
			logger.error("Erro método executar - SQLException: " , e);
			e.printStackTrace();
		} catch (Exception e) {
			logger.error("Erro método executar - Call processarPlanilha: ", e);
			e.printStackTrace();
		}
		
		logger.info("[[FIM DO ROBO IMPORTADOR DE PLANILHA]]");
	}

	private static String getStringCellValue(Sheet sheet, int rownum, int colnum) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		String retorno = "";

		Row row = sheet.getRow(rownum);

		if (row != null) {
			Cell cell = row.getCell(colnum);

			if (cell != null) {

				if (cell.getCellType() == Cell.CELL_TYPE_NUMERIC && DateUtil.isCellDateFormatted(cell)) {
					retorno = dateFormat.format(cell.getDateCellValue());
				} else {
					cell.setCellType(Cell.CELL_TYPE_STRING);
					retorno = cell.getRichStringCellValue().getString().trim();
				}
			}
		}
		return retorno;
	}
	
	private void processarPlanilha(Connection conAux)  {
		logger.info("[[ENTRANDO NO MÉTODO PROCESSAR PLANILHA]]");

		Map<String, String> parametros;
		try {
			parametros = Funcoes.getParametrosIntegracao(configpath + getClass().getSimpleName());
			String planilhas = parametros.get("planilhas");
			
			if (!"".equals(planilhas)) {
				
				logger.debug("planilhas: " + planilhas);
				
				for (String plan : planilhas.split(";")) {
					
					logger.debug("plan: " + plan);
					
					String[] planilhaFormEtapa = plan.split("@");
					
					logger.debug("planilhas: " + planilhas);
					
					String codFormAnalise = planilhaFormEtapa[0];
					String codEtapaAnalise = planilhaFormEtapa[1];
					String tablename = planilhaFormEtapa[2];
					String campo = planilhaFormEtapa[3].trim();
					
					logger.debug("codFormAnalise: " + codFormAnalise);
					logger.debug("codEtapaAnalise: " + codEtapaAnalise);
					logger.debug("tablename: " + tablename);
					logger.debug("campo planilha: " + planilhaFormEtapa[3].trim());					
					
					// insere na tabela
					try(Connection cnbpm = DBUtils.getConnection("workflow")){
						getProcessData(cnbpm, conAux, codFormAnalise, codEtapaAnalise, tablename, campo);
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					} 					
				}
			} else {
				logger.error("Parametro PLANILHA vazio");
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
	
	private void getProcessData(Connection cnbpm, Connection conAux, String codFormAnalise, String codEtapaAnalise, String tablename, String campo) {
		logger.info("[[ENTRANDO NO MÉTODO GET PROCESS DATA]]");
		
		String codProcesso = "";
		String codEtapaAtual = "";
		String codCiclo = "";
		String codForm = "";
		
		StringBuilder consultaProcesso = new StringBuilder();
		consultaProcesso.append("SELECT p.cod_processo, p.cod_etapa_atual, p.cod_ciclo_atual FROM PROCESSO p")
					.append("	JOIN PROCESSO_ETAPA pe ON pe.cod_processo = p.cod_processo")
					.append("	AND pe.cod_etapa = p.cod_etapa_atual")
					.append("	AND pe.cod_ciclo = p.cod_ciclo_atual")
					.append("	WHERE pe.ide_status = 'A'")
					.append("	AND p.cod_form = ?")
					.append("	AND p.cod_etapa_atual = ?");
		try(PreparedStatement pst = cnbpm.prepareStatement(consultaProcesso.toString())){
			logger.info("codFormAnalise: " + codFormAnalise);
			logger.info("codEtapaAnalise: " + codEtapaAnalise);
			pst.setString(1, codFormAnalise);
			pst.setString(2, codEtapaAnalise);
			try(ResultSet rs = pst.executeQuery()){
				while(rs.next()) {
					codProcesso = rs.getString("cod_processo");
					codEtapaAtual = rs.getString("cod_etapa_atual");
					codCiclo = rs.getString("cod_ciclo_atual");
					codForm = getCodForm(cnbpm, codProcesso);
					clearTable(conAux, tablename, codEtapaAtual, codEtapaAnalise);
					importaPlanilha(cnbpm, conAux, codProcesso, codEtapaAtual, codCiclo, codFormAnalise, codEtapaAnalise , campo, tablename);
					registraAlteracoes(conAux, tablename, codProcesso, codEtapaAtual);
					execucaoAtividade(cnbpm, codProcesso, codEtapaAtual, codCiclo);
				}
			}
		} catch (SQLException e) {
			logger.error("Erro método getProcessData - SQLException: ", e);
			e.printStackTrace();
		}
					
	}
	
	private void clearTable(Connection cnbpm, String tablename, String codEtapa, String codEtapaAnalise) {

		if(codEtapaAnalise.equals(codEtapa)) {
			
			StringBuilder sql = new StringBuilder();
			sql.append("delete from ")
			.append(	tablename);
			
			try (PreparedStatement pst = cnbpm.prepareStatement(sql.toString())) {
				pst.execute();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
		}		
	}
	
	private String getPlanilha(Connection cnbpm, String codProcesso, String codEtapa, String codCiclo, String codFormAnalise, String codEtapaAnalise, String campo) {
		logger.info("[[ENTRANDO NO METODO GET PLANILHA]]");

		String ret = "";
		String formTable = getFormTable(cnbpm, codFormAnalise);
//		String[] splitCampo = campo.split("\\$");
		String campoQuery = campo.replace("$", "");

		StringBuilder consultaCampo = new StringBuilder();
		consultaCampo.append("SELECT ")
				.append(	campoQuery)
				.append("	AS CAMPO")
				.append("	FROM ")
				.append(	formTable)
				.append("	WHERE COD_PROCESSO_F = ")
				.append(	codProcesso)
				.append(" 	AND COD_ETAPA_F = ")
				.append(	codEtapa)
				.append("	AND COD_CICLO_F = ")
				.append(	codCiclo);
		
		logger.info("query: " + consultaCampo);
		try(PreparedStatement pst = cnbpm.prepareStatement(consultaCampo.toString())){
			try(ResultSet rs = pst.executeQuery()){
				while(rs.next()) {
					ret = rs.getString("CAMPO");
				}
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		logger.info("ret: " + ret);
		return ret;
	}
	
	private String getFormTable(Connection cnbpm, String codFormAnalise) {
		logger.info("[[ENTRANDO NO METODO GET FORM TABLE]]");
		
		String ret = "";
		StringBuilder consultaNomeTabela = new StringBuilder();
		consultaNomeTabela.append("SELECT des_nome_tabela ")
						.append("	FROM formulario ")
						.append("	WHERE cod_form LIKE ?");
		
		logger.info("query: " + consultaNomeTabela);
		
		try(PreparedStatement pst = cnbpm.prepareStatement(consultaNomeTabela.toString())){
			pst.setString(1, codFormAnalise);
			try(ResultSet rs = pst.executeQuery()){
				while(rs.next()) {
					ret = rs.getString("des_nome_tabela");
				}
			}
		} catch (SQLException e) {
			logger.error("Erro no método getFormTable - SQLException: " ,e);
			e.printStackTrace();
		}
		logger.info("ret: " + ret);
		return ret;
	}
	
	private void importaPlanilha(Connection cnbpm, Connection conAux, String codProcesso, String codEtapa, String codCiclo, String codFormAnalise, String codEtapaAnalise, String campo, String tablename) {
		logger.info("[[ENTRANDO NO METODO IMPORTAR PLANILHA]]");
		
		Workbook workbook = null;
		Sheet sheet;
		
		String planilha = getPlanilha(cnbpm, codProcesso, codEtapa, codCiclo, codFormAnalise, codEtapaAnalise, campo);
		
		logger.info("planilha: " + planilha);
		
			try {
				Map<String, InputStream> bpmFile = getBPMFile(planilha);
				String filename = bpmFile.keySet().iterator().next();
				InputStream is = bpmFile.get(filename);
				
				if (filename.endsWith(".xlsx") || filename.endsWith(".XLSX")) {
					workbook = new XSSFWorkbook(is);
				} else if (filename.endsWith(".xls") || filename.endsWith(".XLS")) {
					workbook = new HSSFWorkbook(is);
				}

				if (workbook != null) {
					sheet = workbook.getSheetAt(0);
	
					int cellnum = 0;
					int linenum = 0;
					Row row = sheet.getRow(cellnum);
					int lastCellNum = row.getLastCellNum();
					int lastLineNum = sheet.getLastRowNum();
					List<String> dados = new ArrayList<String>();
	
					for (linenum = 1; linenum <= lastLineNum; linenum++) {
						for (cellnum = 0; cellnum <= lastCellNum-1; cellnum++) {
							dados.add(getStringCellValue(sheet, linenum, cellnum));
						}
						logger.debug(dados);
						insertTable(conAux, codProcesso, tablename, dados);
						dados.clear();
					}	
				} else {
					logger.error("[ PLANILHA INVALIDA ]");
				}
			} catch (IOException e) {
				logger.error("Erro método importaPlanilha - IOException: ", e); 
				e.printStackTrace();
			}
	}
	
	private Map<String, InputStream> getBPMFile(String bpmFilename) {
		logger.info("[[ENTRANDO NO METODO GET BPM FILE]]");
	
		logger.info("bpmFilename: " + bpmFilename);
		
		Map<String, InputStream> bpmFile = new HashMap<String, InputStream>();

		String filename = bpmFilename.split(":")[0];
		String ecmKey = bpmFilename.split(":")[1];
		
		logger.info("filename: " + filename);
		logger.info("ecmKey: " + ecmKey);

		InputStream in;
		try {
			in = ECMFactory.documento().lerArquivo(ecmKey.trim());
			bpmFile.put(filename, in);
		} catch (ProfileException e) {
			logger.error("Erro método getBPMFile - ProfileException: ", e); 
			e.printStackTrace();
		} catch (ArquivoNaoEncontratoException e) {
			logger.error("Erro método getBPMFile - ArquivoNaoEncontratoException: ", e); 
			e.printStackTrace();
		} catch (DocumentoException e) {
			logger.error("Erro método getBPMFile - DocumentoException: ", e); 
			e.printStackTrace();
		} catch (CodigoArquivoInvalidoException e) {
			logger.error("Erro método getBPMFile - CodigoArquivoInvalidoException: ", e); 
			e.printStackTrace();
		}

		return bpmFile;
	}
	
	private void insertTable(Connection conAux, String codProcesso, String tablename, List<String> dados) {
		logger.info("[[ENTRANDO NO METODO INSERT TABLE]]");

		logger.debug("tablename: " + tablename);

		int idx = 0;
		StringBuilder values = new StringBuilder();
		
		for (String value : dados) {
			idx++;
			
			if(value.toString().equals("")) {
				values.append("null");
			}else {
				values.append("'");
				values.append(value);
				values.append("'");
			}
			if(dados.size() != idx) {
				values.append(", ");
			}
		}
			
		StringBuilder sql = new StringBuilder();
		sql.append("insert into " + tablename)
		.append("	values (")
		.append(	values.toString() )
		.append(") ");

		logger.debug("INSERT DADOS: " + sql.toString());

		try (PreparedStatement pst = conAux.prepareStatement(sql.toString())) {
			pst.execute();
		} catch (SQLException e) {
			logger.error("Erro método insertTable - SQLException: ", e); 
			e.printStackTrace();
		}
	}
	
	private void registraAlteracoes(Connection cnbpm, String tablename, String codProcesso, String codEtapa) {
		logger.info("[[ENTRANDO NO METODO REGISTRA ALTERACOES]]");

		StringBuilder sql = new StringBuilder();
		sql.append(" insert into ")
		.append(	tablename)
		.append(	"_alteracao  ( ")
		.append("	cod_processo_bpm ")
		.append("	, data_processamento ")
		.append("	, usuario_resp_etapa ")
		.append("	)")
		.append("	values(?, now(), ?)");
		try (PreparedStatement pst = cnbpm.prepareStatement(sql.toString())) {
			pst.setString(1, codProcesso);
			pst.setString(2, codEtapa);
			pst.execute();
		} catch (SQLException e) {
			logger.error("Erro método registraAlteracoes - SQLException: ", e); 
			e.printStackTrace();
		}
	}
	
	private String execucaoAtividade(Connection cnbpm, String codProcesso, String codEtapa, String codCiclo) {
		logger.info("[[ENTRANDO NO METODO EXECUTA ATIVIDADES]]");
		
		String retAprovacao = "";
		
		try {
			Map<String, String> parametros = Funcoes.getParametrosIntegracao(configpath + "tarefa.automatica.properties");
			
			String login = parametros.get("loginUsuarioAutomatico");
			String senha = parametros.get("senhaUsuarioAutomatico");
			String codUsuario = parametros.get("codUsuarioAutomatico");
			
			String sso = parametros.get("enderecoSSO");
			String bpm = parametros.get("enderecoBPM");
//			String formApp = parametros.get("enderecoFormAPP");
			
			String token = gerarAccessToken(login, senha, sso);
			
			String teste = modoTeste(codProcesso);
			
			DadosProcesso dp = new DadosProcesso("P");
			
			DadosProcessoAbertura procOrigemUtil = new DadosProcessoAbertura();
			procOrigemUtil.setProcessInstanceId(codProcesso);
			procOrigemUtil.setCurrentActivityInstanceId(codEtapa);
			procOrigemUtil.setCurrentCycle(codCiclo);
			procOrigemUtil.setModoTeste("S".equals(teste) ? "true" : "false");
						
			AprovaProcesso aprovaProcesso = new AprovaProcesso(bpm, token, procOrigemUtil, dp, procOrigemUtil.getModoTeste(), codUsuario);
			
			retAprovacao = aprovaProcesso.aprovaProcesso();
			
			logger.info("RETORNO APROVACAO: " + retAprovacao);
			
			
		} catch (Exception e) {
			logger.error("Erro método execucaoAtividade - SQLException: ", e); 
			e.printStackTrace();
		}
		return retAprovacao;
	}
	
	
	private String gerarAccessToken(String loginRobo, String senhaRobo, String urlSSo) throws Exception, LoginAuthenticationException {
		logger.info("[[ENTRANDO NO METODO GERAR ACCESS TOKEN]]");
		
		String token = "";
		
		try {
			DadosLogin loginUtil = new DadosLogin(loginRobo, senhaRobo, false);
			LoginAutenticacao loginAutenticacao = new LoginAutenticacao(urlSSo, loginUtil);
			token = loginAutenticacao.getToken();
		} catch (Exception e) {
			logger.error("[ ERRO ] : ", e);
			System.out.println("[ ERRO ] : " +  Funcoes.exceptionPrinter(e));
		}
		return token;
	}

	private String modoTeste(String codProcesso) {
		logger.info("[[ENTRANDO NO METODO MODO TESTE]]");
		
		String ret = "";
		
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT p.ide_beta_teste AS teste, f.email_teste, p.cod_versao")
		.append("	FROM processo p, formulario f")
		.append("	WHERE p.cod_processo   = ?")
		.append("	AND p.cod_form       = f.cod_form")
		.append("	AND p.cod_versao     = f.cod_versao");
		try(Connection con = DBUtils.getConnection("workflow")){
			try(PreparedStatement pst = con.prepareStatement(sql.toString())){
				pst.setString(1, codProcesso);
				try(ResultSet rs = pst.executeQuery()){
					while(rs.next()) {
						ret = rs.getString("teste");
					}
				}
			}
		} catch (SQLException e) {
			logger.error("SQL Exception: " , e);
			e.printStackTrace();
		}

		return ret;
	}
	
	private String getCodForm(Connection con, String codProcesso) {
		String ret = "";
		
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT cod_form FROM processo WHERE cod_processo = ? ");
		try(PreparedStatement pst = con.prepareStatement(sql.toString())){
			pst.setString(1, codProcesso);
			try(ResultSet rs = pst.executeQuery()){
				if(rs.next()) {
					ret = rs.getString("cod_form");
				}
			}
		} catch (SQLException e) {
			logger.error("SQLException - getCodForm: ",e);
			e.printStackTrace();
		}
		
		return ret;
	}

	@Override
	public List<WebServicesVO> getWebServices() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setWebServices(WebServicesVO arg0) {
		// TODO Auto-generated method stub
		
	}

}
