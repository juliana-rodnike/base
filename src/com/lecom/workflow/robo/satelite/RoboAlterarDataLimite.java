package com.lecom.workflow.robo.satelite;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.lecom.tecnologia.db.DBUtils;
import com.lecom.workflow.cadastros.common.util.CalculaTempoAtraso;
import com.lecom.workflow.cadastros.common.util.CalculaTempoLimite;
import com.lecom.workflow.cadastros.common.util.Funcoes;
import com.lecom.workflow.cadastros.common.util.RetornaInformacoesBPM;
import com.lecom.workflow.robo.face.WebServices;
import com.lecom.workflow.robo.face.WebServicesVO;

import br.com.lecom.atos.servicos.annotation.Execution;
import br.com.lecom.atos.servicos.annotation.RobotModule;
import br.com.lecom.atos.servicos.annotation.Version;

@RobotModule("RoboAlterarDataLimite")
@Version({1,0,0})
public class RoboAlterarDataLimite implements WebServices{
	
	private static final Logger logger = Logger.getLogger(RoboAlterarDataLimite.class);
	private String configPath = Funcoes.getWFRootDir() + "/upload/cadastros/config/";

	
	@Execution
	public void executaAlteracoesDataLimite(){
		
		logger.debug("Inicio Robo executaAlteracoesDataLimite"); 		
		try {
			
			RetornaInformacoesBPM retornaDadosBaseBPM = new RetornaInformacoesBPM();
			Map<String,String> parametros = Funcoes.getParametrosIntegracao(configPath +"RoboAlterarDataLimite");
			String alteracoesLimite = parametros.get("alteraDataLimiteGeral");
			if(!alteracoesLimite.equals("")) {
				alteraDataLimiteDias(retornaDadosBaseBPM, alteracoesLimite);
			}
			
			String alteracoesLimiteCampo = parametros.get("alteracoesLimiteCampo");
			if(!alteracoesLimiteCampo.equals("")) {
				alteraDataLimiteCampo(retornaDadosBaseBPM, alteracoesLimiteCampo);
			}
			
			logger.debug("Fim Robo executaAlteracoesDataLimite");
			
		} catch (Exception e) {
			
			logger.error("[ERRO] : ", e);
			e.printStackTrace();
			
		}		
	}
	
	private void alteraDataLimiteCampo(RetornaInformacoesBPM retornaDadosBaseBPM, String alteracoesLimite)
			throws Exception, SQLException {
		logger.debug("alteraDataLimiteCampo= "+alteracoesLimite);
		String[] alteracoes = alteracoesLimite.split(";");
		
		for (String alteracao : alteracoes) {
			logger.debug("alteracao= "+alteracao);
			String[] camposAlteracaoLimite = alteracao.split("@");
			
			String codForm = camposAlteracaoLimite[0];
			String codEtapaLimite = camposAlteracaoLimite[1];
			String tabelaModelo = camposAlteracaoLimite[2];
			String campoLimiteDefinido = camposAlteracaoLimite[3]; //campo PRAZO_CONDICIONANTE
			String horaLimiteDefinido = Funcoes.nulo(camposAlteracaoLimite[4],"");
			
			Calendar dataGravacao = Calendar.getInstance();
			Calendar dataLimite = Calendar.getInstance();
			Map<String, Map<String, String>> turnoSemanaMap = null;
			List<String> diasNaoTrabalhadosList = null;
						
			try(Connection con = DBUtils.getConnection("workflow")){
				
				StringBuilder sqlVerificaSLA = new StringBuilder();
				sqlVerificaSLA.append(" SELECT ");
				sqlVerificaSLA.append(" 	p.COD_PROCESSO, p.COD_ETAPA_ATUAL, p.COD_CICLO_ATUAL, pe.dat_gravacao, pe.DAT_LIMITE, pe.DAT_FINALIZACAO, pe.VLR_ATRASO1 ");
				sqlVerificaSLA.append(" ,f."+campoLimiteDefinido);
				sqlVerificaSLA.append(" from  processo p , processo_etapa pe, "+tabelaModelo+" f ");
				sqlVerificaSLA.append(" where cod_form = ? ");
				sqlVerificaSLA.append("	and f.COD_PROCESSO_F = p.COD_PROCESSO");
				sqlVerificaSLA.append("	and f.COD_ETAPA_F = p.COD_ETAPA_ATUAL");
				sqlVerificaSLA.append("	and f.COD_CICLO_F = p.COD_CICLO_ATUAL");
				sqlVerificaSLA.append("	and p.COD_PROCESSO = pe.COD_PROCESSO");
				sqlVerificaSLA.append("	and p.COD_ETAPA_ATUAL = pe.COD_ETAPA");
				sqlVerificaSLA.append("	and p.COD_CICLO_ATUAL = pe.COD_CICLO");
				sqlVerificaSLA.append("	and p.COD_ETAPA_ATUAL = ? ");
				sqlVerificaSLA.append("	and pe.DAT_LIMITE is null ");
				sqlVerificaSLA.append(" AND PE.IDE_STATUS = 'A' ");

				// Recupera o turno semanal cadastrado no BPM
				turnoSemanaMap = retornaDadosBaseBPM.getTurnoSemanaMapBanco(con);

				// Recupera os dias não trabalhados por ser feriado
				diasNaoTrabalhadosList = retornaDadosBaseBPM.getDiasNaoTrabalhadosList(con);

				logger.debug("sqlVerificaSLA = "+sqlVerificaSLA.toString());
				try(PreparedStatement pst = con.prepareStatement(sqlVerificaSLA.toString())){
					
					pst.setString(1, codForm);
					pst.setString(2, codEtapaLimite);
					
					try(ResultSet rs = pst.executeQuery()){
						
						while(rs.next()){
							
							logger.debug("Inicio while resultset");
							String codProcesso = rs.getString("cod_processo");
							String codEtapa = rs.getString("cod_etapa_atual");
							String codCiclo = rs.getString("cod_ciclo_atual");
							Timestamp dataGravacaoEtapaAtual = rs.getTimestamp("dat_gravacao");
					
							Date dataLimiteDefinido = rs.getDate(campoLimiteDefinido.trim());								
							if(dataLimiteDefinido != null){
								
								logger.debug("dataLimiteDefinido = "+dataLimiteDefinido);
								logger.debug("horaLimiteDefinido = "+horaLimiteDefinido);
								Calendar dataParam = Calendar.getInstance();
								dataParam.setTime(dataLimiteDefinido);
								
								if(!horaLimiteDefinido.equals("")){
									String[] hora = horaLimiteDefinido.split(":");
									dataParam.set(Calendar.HOUR_OF_DAY,Integer.parseInt(hora[0]));
									dataParam.set(Calendar.MINUTE,Integer.parseInt(hora[1]));
								}
															
								//dataLimite.setTimeInMillis(dataParam.getTime() + 28800000);
								dataLimite = dataParam;
								dataGravacao.setTimeInMillis(dataGravacaoEtapaAtual.getTime());
								
								dataLimite = getDiaUtil(dataLimite, diasNaoTrabalhadosList);
								
								long  atraso1 = new CalculaTempoAtraso(dataLimite, dataGravacao, turnoSemanaMap, diasNaoTrabalhadosList).getTotalEmMilisegundos();
								
								logger.debug("codProcesso = "+codProcesso);
								logger.debug("codEtapa = "+codEtapa);
								logger.debug("codCiclo = "+codCiclo);
								logger.debug("campoLimiteDefinido = "+campoLimiteDefinido+" dataLimiteDefinido = "+dataLimiteDefinido);
								logger.debug("dataLimite = "+dataLimite.getTime());
								logger.debug("atraso1 = "+atraso1);
								
								// Update para configuração do SLA na etapa
								StringBuilder sqlConfiguraSLA = new StringBuilder();
								sqlConfiguraSLA.append(" UPDATE ");
								sqlConfiguraSLA.append(" 	PROCESSO_ETAPA ");
								sqlConfiguraSLA.append(" SET ");
								sqlConfiguraSLA.append("     VLR_ATRASO1 = ? ");
								sqlConfiguraSLA.append("     , DAT_LIMITE = ? ");
								sqlConfiguraSLA.append("     , DAT_FINALIZACAO = ? ");
								sqlConfiguraSLA.append(" WHERE ");
								sqlConfiguraSLA.append(" 	COD_PROCESSO = ? ");
								sqlConfiguraSLA.append(" 	AND COD_ETAPA = ? ");
								sqlConfiguraSLA.append(" 	AND COD_CICLO = ? ");
								
								try (PreparedStatement pstConfiguraSLA = con.prepareStatement(sqlConfiguraSLA.toString());) {
		
									// Caso seja o primeiro ciclo
									pstConfiguraSLA.setLong(1, atraso1);
									pstConfiguraSLA.setTimestamp(2, new Timestamp(dataLimite.getTimeInMillis()));
									pstConfiguraSLA.setTimestamp(3, new Timestamp(dataLimite.getTimeInMillis()));
									pstConfiguraSLA.setString(4, codProcesso);
									pstConfiguraSLA.setString(5, codEtapa);
									pstConfiguraSLA.setString(6, codCiclo);
									pstConfiguraSLA.executeUpdate();
								}
								
							} else {
								logger.debug("Campo definido para data limite está com valor nulo");
							}
						}
					}
				}
			}
		}
		
		logger.debug("Fim Robo executaAlteracoesDataLimite");
	}

	public Calendar getDiaUtil(Calendar data, List<String> diasNaoTrabalhadosList){
		
		logger.debug(" getDiaUtil ");
		Calendar retorno = Calendar.getInstance();
		
		try {
			
			while(validaData(data,diasNaoTrabalhadosList)){
				logger.debug(" validando data = "+data.getTime());
				data = retornaData(data,diasNaoTrabalhadosList);
				logger.debug(" retornaData data = "+data.getTime());
			}
			
			retorno = data;
			
		} catch (Exception e) {
			
			logger.error("[ERRO] : ", e);
			throw e;
		}
		
		return retorno;
	}
	
	public boolean validaData(Calendar data,List<String> diasNaoTrabalhadosList){
		
		logger.debug(" validaData = "+data.getTime());
		boolean validacaoData = false;
		int diaSemana = data.get(Calendar.DAY_OF_WEEK);
		
		if(diaSemana==1){ //Domingo
			validacaoData = true;
		
		} else if(diaSemana==7){ //Sábado
			validacaoData = true;
		
		} else {
			SimpleDateFormat dateFormat 	= new SimpleDateFormat("dd/MM/yyyy");
			String sDataAux = dateFormat.format(data.getTime());
			if(diasNaoTrabalhadosList.contains(sDataAux)) {
				validacaoData = true;			
			}
		}
		
		logger.debug(" validacaoData = "+validacaoData);
		return validacaoData;
	}
	
	public Calendar retornaData(Calendar data,List<String> diasNaoTrabalhadosList){
		
		logger.debug(" retornaData = "+data.getTime());
		Calendar dataNova = Calendar.getInstance();
		int diaSemana = data.get(Calendar.DAY_OF_WEEK);
		
		if(diaSemana==1){ //Domingo
			data.add(Calendar.DAY_OF_MONTH, 1);
		
		} else if(diaSemana==7){ //Sábado
			data.add(Calendar.DAY_OF_MONTH, 2);
		}
		
		SimpleDateFormat dateFormat 	= new SimpleDateFormat("dd/MM/yyyy");
		String sDataAux = dateFormat.format(data.getTime());
		if(diasNaoTrabalhadosList.contains(sDataAux)) {
			data.add(Calendar.DAY_OF_MONTH, 1);			
		}
		
		dataNova = data;
		logger.debug(" retornaData  dataNova = "+dataNova.getTime());
		return dataNova;
	}
	
	private void alteraDataLimiteDias(RetornaInformacoesBPM retornaDadosBaseBPM, String alteracoesLimite)
			throws Exception, SQLException {
		logger.debug("alteraDataLimiteDias= "+alteracoesLimite);
		String[] alteracoes = alteracoesLimite.split(";");
		
		for (String alteracao : alteracoes) {
			logger.debug("alteracao= "+alteracao);
			String[] camposAlteracaoLimite = alteracao.split("@");
			
			String codForm  	   = camposAlteracaoLimite[0]; //Código do formulário
			String codEtapaAlterar = camposAlteracaoLimite[1]; //Etapa
			String QtdeDiasHoras   = camposAlteracaoLimite[2]; //Quantidade de dias ou horas à adicionar
			String identificadorDH = camposAlteracaoLimite[3]; //Identificador para somar(D = Dias, H = Horas)
			String identificadorUC = camposAlteracaoLimite[4]; //Identificador dias (U = Uteis, C = Corridos)
			
			Calendar dataGravacaoEtapa = Calendar.getInstance();
			Calendar dataLimite = Calendar.getInstance();
			Map<String, Map<String, String>> turnoSemanaMap = null;
			List<String> diasNaoTrabalhadosList = null;
			long atraso1 = 0;			
			try(Connection con = DBUtils.getConnection("workflow")){
				
				StringBuilder sqlVerificaSLA = new StringBuilder();
				sqlVerificaSLA.append("SELECT PE.COD_PROCESSO, PE.COD_ETAPA, PE.COD_CICLO, PE.DAT_GRAVACAO, ");
				sqlVerificaSLA.append("PE.DAT_LIMITE, PE.DAT_FINALIZACAO, PE.VLR_ATRASO1  ");
				sqlVerificaSLA.append("FROM  PROCESSO_ETAPA PE ");
				sqlVerificaSLA.append("WHERE PE.COD_PROCESSO IN (SELECT P.COD_PROCESSO FROM PROCESSO P ");
				sqlVerificaSLA.append("									WHERE P.COD_PROCESSO = PE.COD_PROCESSO ");
				sqlVerificaSLA.append("									  AND P.COD_FORM = ?)	");
				sqlVerificaSLA.append("and PE.COD_ETAPA = ? 			 	");
				sqlVerificaSLA.append("and PE.DAT_LIMITE IS NULL 			  ");
				sqlVerificaSLA.append("AND PE.IDE_STATUS = 'A'");

				// Recupera o turno semanal cadastrado no BPM
				turnoSemanaMap = retornaDadosBaseBPM.getTurnoSemanaMapBanco(con);

				// Recupera os dias não trabalhados por ser feriado
				diasNaoTrabalhadosList = retornaDadosBaseBPM.getDiasNaoTrabalhadosList(con);
				
				logger.debug("sqlVerificaSLA = "+sqlVerificaSLA.toString());
				try(PreparedStatement pst = con.prepareStatement(sqlVerificaSLA.toString())){
					
					pst.setString(1, codForm);
					pst.setString(2, codEtapaAlterar);

					try(ResultSet rs = pst.executeQuery()){
						
						while(rs.next()){
							
							logger.debug("Inicio while resultset");
							String codProcesso 				 = rs.getString("cod_processo");
							String codEtapa    				 = rs.getString("cod_etapa");
							String codCiclo    				 = rs.getString("cod_ciclo");
							Timestamp dataGravacaoEtapaAtual = rs.getTimestamp("dat_gravacao");
							
							if(identificadorUC.equals("U")){	
								dataGravacaoEtapa.setTimeInMillis(dataGravacaoEtapaAtual.getTime());
								dataLimite = new CalculaTempoLimite(dataGravacaoEtapa, 0l, turnoSemanaMap, diasNaoTrabalhadosList).getCalculaTempoAtrasoSegundos(Long.parseLong(QtdeDiasHoras), identificadorDH);
																		
							    atraso1 = new CalculaTempoAtraso(dataLimite, dataGravacaoEtapa, turnoSemanaMap, diasNaoTrabalhadosList).getTotalEmMilisegundos();							
							}else{	
								Calendar dataParam = Calendar.getInstance();
								dataParam.setTime(dataGravacaoEtapaAtual);

								if(!QtdeDiasHoras.equals("") && identificadorDH.equals("H")){
									dataParam.add(Calendar.HOUR_OF_DAY,Integer.parseInt(QtdeDiasHoras));
								}else if (!QtdeDiasHoras.equals("") && identificadorDH.equals("D")){
									dataParam.add(Calendar.DAY_OF_MONTH,Integer.parseInt(QtdeDiasHoras));
								}	
								
								dataLimite = dataParam;
								dataGravacaoEtapa.setTimeInMillis(dataGravacaoEtapaAtual.getTime());
								atraso1 =  dataLimite.getTimeInMillis() - dataGravacaoEtapa.getTimeInMillis();
							}
							
								logger.debug("codProcesso = "+codProcesso);
								logger.debug("codEtapa = "+codEtapa);
								logger.debug("codCiclo = "+codCiclo);
								logger.debug("dataGravacao apos tempoatraso = "+dataGravacaoEtapa.getTime());
								logger.debug("Dias ou Horas à somar = "+ QtdeDiasHoras);
								logger.debug("Somar dias ou horas = " + identificadorDH);
								logger.debug("Somar dias Uteis ou corridos = " + identificadorUC);
								logger.debug("dataLimite  apos tempoatraso = "+dataLimite.getTime());
								logger.debug("atraso1 = "+ atraso1);
								
								// Update para configuração do SLA na etapa
								StringBuilder sqlConfiguraSLA = new StringBuilder();
								sqlConfiguraSLA.append(" UPDATE ");
								sqlConfiguraSLA.append(" 	PROCESSO_ETAPA ");
								sqlConfiguraSLA.append(" SET ");
								sqlConfiguraSLA.append("     VLR_ATRASO1 = ? ");
								sqlConfiguraSLA.append("     , DAT_LIMITE = ? ");
								sqlConfiguraSLA.append("     , DAT_FINALIZACAO = ? ");
								sqlConfiguraSLA.append(" WHERE ");
								sqlConfiguraSLA.append(" 	COD_PROCESSO = ? ");
								sqlConfiguraSLA.append(" 	AND COD_ETAPA = ? ");
								sqlConfiguraSLA.append(" 	AND COD_CICLO = ? ");
								
								try (PreparedStatement pstConfiguraSLA = con.prepareStatement(sqlConfiguraSLA.toString());) {			
									// Caso seja o primeiro ciclo
									pstConfiguraSLA.setLong(1, atraso1);
									pstConfiguraSLA.setTimestamp(2, new Timestamp(dataLimite.getTimeInMillis()));
									pstConfiguraSLA.setTimestamp(3, new Timestamp(dataLimite.getTimeInMillis()));
									pstConfiguraSLA.setString(4, codProcesso);
									pstConfiguraSLA.setString(5, codEtapa);
									pstConfiguraSLA.setString(6, codCiclo);
									pstConfiguraSLA.executeUpdate();
								}									
						}
					}
				}
			}
		}
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
