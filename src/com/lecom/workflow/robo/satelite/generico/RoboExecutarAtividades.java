package com.lecom.workflow.robo.satelite.generico;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.lecom.tecnologia.db.DBUtils;
import com.lecom.workflow.cadastros.common.controller.TokenManagerSSO;
import com.lecom.workflow.cadastros.common.util.Funcoes;
import com.lecom.workflow.cadastros.rotas.AprovaProcesso;
import com.lecom.workflow.cadastros.rotas.CancelarProcesso;
import com.lecom.workflow.cadastros.rotas.exception.CancelaProcessoException;
import com.lecom.workflow.cadastros.rotas.util.DadosProcesso;
import com.lecom.workflow.cadastros.rotas.util.DadosProcessoAbertura;
import com.lecom.workflow.robo.RBOpenWebServices;
import com.lecom.workflow.robo.face.GenericWSVO;
import com.lecom.workflow.robo.face.WebServices;
import com.lecom.workflow.robo.face.WebServicesVO;

import br.com.lecom.atos.servicos.annotation.Execution;
import br.com.lecom.atos.servicos.annotation.RobotModule;
import br.com.lecom.atos.servicos.annotation.Version;

@RobotModule(value = "RoboExecutarAtividades")
@Version({1,0,15})
public class RoboExecutarAtividades implements WebServices {
	
	private static final Logger logger = Logger.getLogger(RoboExecutarAtividades.class);
	private String configPath = Funcoes.getWFRootDir() + "/upload/cadastros/config/";
	
	@Execution
	public void AprovarEtapas() throws Exception{
		
		logger.info(">> Inicio RoboExecutarAtividades Genérico <<");
		
		try ( Connection cnLecom = DBUtils.getConnection("workflow") ) {
			cnLecom.setAutoCommit(false);
			
			try {
				
				Map<String, String> parametros = Funcoes.getParametrosIntegracao(configPath + getClass().getSimpleName());
				String base540 = Funcoes.nulo( parametros.get("base540"), "N" );
				
				Map<String, String> automatico = Funcoes.getParametrosIntegracao(configPath + "tarefa.automatica");
				Integer codUsuarioAutomatico = new Integer ( automatico.get("codUsuarioAutomatico") );
				String loginUsuarioAutomatico = automatico.get("loginUsuarioAutomatico");
				String senhaUsuarioAutomatico = automatico.get("senhaUsuarioAutomatico");
				String urlSSO = automatico.get("enderecoSSO");
				String urlBPM = automatico.get("enderecoBPM");
				
				// Gerar Access Token SSO
				String accessToken530SSO = TokenManagerSSO.getInstance().getAccessToken(logger, cnLecom, urlSSO, loginUsuarioAutomatico, senhaUsuarioAutomatico).getToken();
				logger.info("accessToken530SSO = " + accessToken530SSO);
				
				// Data Atual
				Calendar datAtual = Calendar.getInstance();
				
				// Cria um Objeto LocalDate com a data atual ( Java 8 ).
		        LocalDate dataAtual = LocalDate.now();
	
				// Aprova etapas, em paralelo, definidas no propertie, paradas com o Robô
				executarAtividadeConcentradora(cnLecom, base540, false, parametros.get("aprovacoesParalelas"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "P", null, null, false);
	
				// Aprova etapas em uma data determinada por um campo, definido no propertie, que estejam paradas com o Robô
				executarAtividadesDataCampo(cnLecom, base540, false, datAtual, parametros.get("aprovacoesDataCampo"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "P", null, null, false);
				
				// Rejeita etapas em uma data determinada por um campo, definido no propertie, que estejam paradas com o Robô
				executarAtividadesDataCampo(cnLecom, base540, false, datAtual, parametros.get("rejeicoesDataCampo"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "R", null, null, false);
				
				// Aprova atividades que o "prazo máximo", definido para ela, tenha excedido e que estejam paradas com o robô
				executarAtividadesPrazoMaximoExcedido(cnLecom, base540, false, datAtual, parametros.get("aprovacoesEtapasPrazoMaximoExcedido"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "P", null, null, false);
				
				// Rejeita atividades que o "prazo máximo", definido para ela, tenha excedido e que estejam paradas com o robô
				executarAtividadesPrazoMaximoExcedido(cnLecom, base540, false, datAtual, parametros.get("rejeicoesEtapasPrazoMaximoExcedido"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "R", null, null, false);
				
				// Aprova etapas, definidas no propertie, paradas com o Robô
				executarAtividades(cnLecom, base540, false, parametros.get("aprovacoes"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "P", null, null, false);
				
				// Rejeita etapas, definidas no propertie, paradas com o Robô
				executarAtividades(cnLecom, base540, false, parametros.get("rejeicoes"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "R", null, null, false);
				
				
				// ************************************************* Form Novo *************************************************
				
				// Aprova etapas, em paralelo, definidas no propertie, paradas com o Robô
				executarAtividadeConcentradora(cnLecom, base540, true, parametros.get("aprovacoesFNConcentradora"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "P", urlBPM, urlSSO, false);
				// Aprova etapas, em paralelo, definidas no propertie, paradas com Usuário Comum
				executarAtividadeConcentradora(cnLecom, base540, true, parametros.get("aprovacoesFNConcentradoraUC"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "P", urlBPM, urlSSO, true);
				
				// Aprova etapas, em paralelo, definidas no propertie, paradas com o Robô
				executarAtividadeConcentradora(cnLecom, base540, true, parametros.get("rejeicoesFNConcentradora"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "R", urlBPM, urlSSO, false);
				// Aprova etapas, em paralelo, definidas no propertie, paradas com Usuário Comum
				executarAtividadeConcentradora(cnLecom, base540, true, parametros.get("rejeicoesFNConcentradoraUC"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "R", urlBPM, urlSSO, true);
	
				// Aprova etapas em uma data determinada por um campo, definido no propertie, que estejam paradas com o Robô
				executarAtividadesDataCampo(cnLecom, base540, true, datAtual, parametros.get("aprovacoesFNDataCampo"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "P", urlBPM, urlSSO, false);
				// Aprova etapas em uma data determinada por um campo, definido no propertie, que estejam paradas com Usuário Comum
				executarAtividadesDataCampo(cnLecom, base540, true, datAtual, parametros.get("aprovacoesFNDataCampoUC"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "P", urlBPM, urlSSO, true);
				
				// Rejeita etapas em uma data determinada por um campo, definido no propertie, que estejam paradas com o Robô
				executarAtividadesDataCampo(cnLecom, base540, true, datAtual, parametros.get("rejeicoesFNDataCampo"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "R", urlBPM, urlSSO, false);
				// Rejeita etapas em uma data determinada por um campo, definido no propertie, que estejam paradas com Usuário Comum
				executarAtividadesDataCampo(cnLecom, base540, true, datAtual, parametros.get("rejeicoesFNDataCampoUC"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "R", urlBPM, urlSSO, true);
								
				// Aprova atividades que o "prazo máximo", definido para ela, tenha excedido e que estejam paradas com o robô
				executarAtividadesPrazoMaximoExcedido(cnLecom, base540, true, datAtual, parametros.get("aprovacoesFNEtapasPrazoMaximoExcedido"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "P", urlBPM, urlSSO, false);
				// Aprova atividades que o "prazo máximo", definido para ela, tenha excedido e que estejam paradas com Usuário Comum
				executarAtividadesPrazoMaximoExcedido(cnLecom, base540, true, datAtual, parametros.get("aprovacoesFNEtapasPrazoMaximoExcedidoUC"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "P", urlBPM, urlSSO, true);
				
				// Rejeita atividades que o "prazo máximo", definido para ela, tenha excedido e que estejam paradas com o robô
				executarAtividadesPrazoMaximoExcedido(cnLecom, base540, true, datAtual, parametros.get("rejeicoesFNEtapasPrazoMaximoExcedido"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "R", urlBPM, urlSSO, false);
				// Rejeita atividades que o "prazo máximo", definido para ela, tenha excedido e que estejam paradas com Usuário Comum
				executarAtividadesPrazoMaximoExcedido(cnLecom, base540, true, datAtual, parametros.get("rejeicoesFNEtapasPrazoMaximoExcedidoUC"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "R", urlBPM, urlSSO, true);
	
				// Aprova etapas, definidas no propertie, paradas com o Robô
				executarAtividades(cnLecom, base540, true, parametros.get("aprovacoesFN"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "P", urlBPM, urlSSO, false);
				// Aprova etapas, definidas no propertie, paradas com Usuário Comum
				executarAtividades(cnLecom, base540, true, parametros.get("aprovacoesFNUC"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "P", urlBPM, urlSSO, true);
				
				// Rejeita etapas, definidas no propertie, paradas com o Robô
				executarAtividades(cnLecom, base540, true, parametros.get("rejeicoesFN"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "R", urlBPM, urlSSO, false);
				// Rejeita etapas, definidas no propertie, paradas com Usuário Comum
				executarAtividades(cnLecom, base540, true, parametros.get("rejeicoesFNUC"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "R", urlBPM, urlSSO, true);
				
				// Cancela processos que estão na atividade inicial, ciclo 1, parados a mais de x dias
				cancelaProcessoNaoEnviado(cnLecom, base540, dataAtual, parametros.get("cancelaFNProcessoNaoEnviado"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, urlBPM, urlSSO, false);
				// Cancela processos que estão na atividade inicial, ciclo 1, parados a mais de x dias, com Usuário Comum
				cancelaProcessoNaoEnviado(cnLecom, base540, dataAtual, parametros.get("cancelaFNProcessoNaoEnviadoUC"), codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, urlBPM, urlSSO, true);
				
				// Configuraçâo global : finaliza todos os processos que estão na atividade final, parados a mais de x dias
				configGlobalCancelaProcessosEtpInicial(cnLecom, base540, dataAtual, codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, urlBPM, urlSSO, true, null, Funcoes.nulo(parametros.get("cancelaProcessosEtpInicialCG"), "0"));
				
				// Configuraçâo global : finaliza todos os processos que estão na atividade final, parados a mais de x dias
				configGlobalFinalizaProcessosEtpFinal(cnLecom, base540, dataAtual, codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, urlBPM, urlSSO, true, null, Funcoes.nulo(parametros.get("finalizaProcessosEtpFinalCG"), "0"));
				
			} catch (Exception e) {
				logger.error("[ ERRO ] : ", e);
				cnLecom.rollback();
			}
		}
		
		logger.info(">> Fim RoboExecutarAtividades Genérico <<");
	}
	
	// Executar atividades do form 5.20
	private String executaEtapaProcesso( int codForm, int codProcesso, int codEtapa, int codCiclo, String valores, String paramAcaoAprovaRejeita, String loginRobo, String senhaRobo ) throws Exception {
		
		logger.info("INICIO executaEtapaProcesso");
		logger.info("VALORES ( codForm : " + codForm + " / codProcesso : " + codProcesso + " / codEtapa : " + codEtapa + " / codCiclo : " + codCiclo + " / valores : " + valores + " / acao : " + paramAcaoAprovaRejeita);// + " / loginRobo : " + loginRobo + " / senhaRobo : " + senhaRobo);
		
		GenericWSVO webServicesVO = new GenericWSVO();
		webServicesVO.setCodForm(codForm);
		webServicesVO.setCodProcesso(codProcesso);
		webServicesVO.setCodEtapa(codEtapa);
		webServicesVO.setCodCiclo(codCiclo);	
		webServicesVO.setLoginUsuario(loginRobo);
		webServicesVO.setSenhaUsuario(senhaRobo);		
		webServicesVO.setAcao(paramAcaoAprovaRejeita);
		webServicesVO.setValores(valores);
		
		String retorno = RBOpenWebServices.getInstance().executeWebServices(webServicesVO, RBOpenWebServices.EXECUTA_ETAPA_PROCESSO);
		
		logger.info("FIM executaEtapaProcesso");
		
		return retorno;
	}
	
	/**
	 * Metodo que chama o serviço de execução de atividades do form novo 5.30
	 * @param String codProcessoExecutar - Obrigatório
	 * @param String codAtividadeExecutar - Obrigatório
	 * @param String codCicloExecutar - Obrigatório
	 * @param String modoTeste - Obrigatório
	 * @param Map<String, String> camposValores - Não Obrigatório - Onde MAP deve conter nome do campo e valores
	 * @param Map<String, List<Map<String, Object>>> gridValores - Não Obrigatório - Onde MAP deve conter o nome da grid e um LIST<MAP> que conterá os nomes dos campos e valores
	 * @param Integer codUsuarioAutomatico - Obrigatório
	 * @param String loginUsuarioAutomatico - Obrigatório
	 * @param String senhaUsuarioAutomatico - Obrigatório
	 * @param String paramAcaoAprovaRejeita - Obrigatório - Onde P = Aprovar, R = Rejeitar
	 * @return String retornoAprovacao
	 * @throws Exception
	 */
	private String executaAtividProcessoFormNovo( Connection cnLecom, String codProcessoExecutar, String codAtividadeExecutar, String codCicloExecutar, String modoTeste, 
												  Map<String,String> camposValores, Map<String,List<Map<String, Object>>> gridValores, Integer codUsuarioAutomatico, 
												  String loginUsuarioAutomatico, String senhaUsuarioAutomatico, String paramAcaoAprovaRejeita, String urlBPM, String urlSSO ) throws Exception {
		
		logger.info("INICIO executaAtividProcessoFormNovo");
		logger.info("VALORES ( codProcessoExecutar : " + codProcessoExecutar + " / codAtividadeExecutar : " + codAtividadeExecutar + " / codCicloExecutar : " + codCicloExecutar + " / modoTeste : " + modoTeste + " / paramAcaoAprovaRejeita : " + paramAcaoAprovaRejeita);
		logger.info("VALORES ( codUsuarioAutomatico : " + codUsuarioAutomatico + " / loginUsuarioAutomatico : " + loginUsuarioAutomatico + " / senhaUsuarioAutomatico : " + senhaUsuarioAutomatico);
		
		String retornoAprovacao = "";
		
		try {
			
			// Gerar Access Token SSO
			String accessToken530SSO = TokenManagerSSO.getInstance().getAccessToken(logger, cnLecom, urlSSO, loginUsuarioAutomatico, senhaUsuarioAutomatico).getToken();

			logger.info("accessToken530SSO = " + accessToken530SSO);
			// Caso não seja gerado o token não executa as chamadas aos serviços.
			if ( accessToken530SSO != null && !"".equalsIgnoreCase( accessToken530SSO ) ) {
			
				DadosProcesso dadosProcesso = new DadosProcesso(paramAcaoAprovaRejeita);
				
				if ( camposValores != null ) {
				dadosProcesso.geraPadroes(camposValores);
				}
				
				if ( gridValores != null ) {
					gridValores.forEach((nomeGrid, valores) -> dadosProcesso.geraValoresGrid(nomeGrid, valores) );
				}
				
				DadosProcessoAbertura procOrigemUtil = new DadosProcessoAbertura();
				procOrigemUtil.setProcessInstanceId(codProcessoExecutar);
				procOrigemUtil.setCurrentActivityInstanceId(codAtividadeExecutar);
				procOrigemUtil.setCurrentCycle(codCicloExecutar);
				procOrigemUtil.setModoTeste(modoTeste.equals("S") ? "true" : "false");
				
				logger.debug("procOrigemUtil info: " + procOrigemUtil.getCurrentActivityInstanceId() + ", " + procOrigemUtil.getCurrentCycle() + ", " + procOrigemUtil.getProcessInstanceId() + " modoTeste= "+procOrigemUtil.getModoTeste()+" | usuario: " + codUsuarioAutomatico);
				AprovaProcesso aprovaProcesso = new AprovaProcesso( urlBPM, accessToken530SSO, procOrigemUtil, dadosProcesso, procOrigemUtil.getModoTeste(), codUsuarioAutomatico.toString() );
				retornoAprovacao = aprovaProcesso.aprovaProcesso();
				logger.debug("retornoAprovacao = " + retornoAprovacao);
			}

		} catch (Exception e) {
			logger.error("executaAtividProcessoFormNovo : ", e);
			retornoAprovacao = Funcoes.exceptionPrinter(e);
		}

		logger.info("FIM executaAtividProcessoFormNovo");
		
		return retornoAprovacao;
	}
	
	
	private String cancelaProcessoFormNovo( Connection cnLecom, String codProcessoExecutar, String codAtividadeExecutar, String codCicloExecutar, String modoTeste, 
			  								Integer codUsuarioAutomatico, String loginUsuarioAutomatico, String senhaUsuarioAutomatico, String urlBPM, String urlSSO ) throws Exception {
		
		String retornoCancelamento = "falha"; 
		
		try {
			
			// Gerar Access Token SSO
			String accessToken530SSO = TokenManagerSSO.getInstance().getAccessToken(logger, cnLecom, urlSSO, loginUsuarioAutomatico, senhaUsuarioAutomatico).getToken();

			logger.info("accessToken530SSO = " + accessToken530SSO);
			// Caso não seja gerado o token não executa as chamadas aos serviços.
			if ( accessToken530SSO != null && !"".equalsIgnoreCase( accessToken530SSO ) ) {
			
				logger.info("INICIO retornoCancelamento");
	
				DadosProcessoAbertura procOrigemUtil = new DadosProcessoAbertura();
				procOrigemUtil.setProcessInstanceId(codProcessoExecutar);
				procOrigemUtil.setCurrentActivityInstanceId(codAtividadeExecutar);
				procOrigemUtil.setCurrentCycle(codCicloExecutar);
				procOrigemUtil.setModoTeste(modoTeste.equals("S") ? "true" : "false");
	
				CancelarProcesso cancelar = new CancelarProcesso(urlBPM, accessToken530SSO, procOrigemUtil, procOrigemUtil.getModoTeste(), codUsuarioAutomatico.toString());
	
				retornoCancelamento = cancelar.cancelarProcesso();
				logger.debug("retornoCancelamento = " + retornoCancelamento);
			}
			
		} catch (CancelaProcessoException e1) {
			logger.error("[ ERRO CancelaProcessoException ] : ", e1);
		}
		
		logger.info("FIM retornoCancelamento");
		return retornoCancelamento;
	}
	
	
	/*
	 * Aprova etapas, em paralelo, definidas no propertie, paradas com o Robô
	 */
	private void executarAtividadeConcentradora( Connection cnLecom, String base540, boolean formNovo, String atividadesExecutar, Integer codUsuarioAutomatico, String loginUsuarioAutomatico, 
												 String senhaUsuarioAutomatico, String paramAcaoAprovaRejeita, String urlBPM, String urlSSO, boolean transferirRobo ) throws Exception{
		
		logger.info("INICIO executaEtapaConcentradora : " + atividadesExecutar);
		
		if( !"".equals(atividadesExecutar) ){
		
			for (String atividadeExecut : atividadesExecutar.split(";")) {
				
				String[] aprovacaoFormEtapa = atividadeExecut.split("@");
				String[] aprovacaoEtapasConcentradora = aprovacaoFormEtapa[1].split("-");
				
				String codFormConcentradora = aprovacaoFormEtapa[0];
				String codEtapaConcentradora = aprovacaoEtapasConcentradora[0];
				String codEtapasParalelismo = aprovacaoEtapasConcentradora[1];
				
				logger.info("PARALELO - Em analise - Form : " + codFormConcentradora + " / Etapa Concentradora : " + codEtapaConcentradora + " / Etapa Paralelismo : " + codEtapasParalelismo);
	
				// Consulta as etapas Concentradoras que ainda estão em aberto 
				StringBuilder sqlConsultaAux1 = new StringBuilder();
				sqlConsultaAux1.append(" 	 SELECT P.COD_FORM, PE.COD_PROCESSO, PE.COD_ETAPA, PE.COD_CICLO, P.IDE_BETA_TESTE ");
				sqlConsultaAux1.append(" 	   FROM PROCESSO_ETAPA PE ");
				sqlConsultaAux1.append(" INNER JOIN PROCESSO P ON ( P.COD_PROCESSO = PE.COD_PROCESSO ) ");
				sqlConsultaAux1.append(" 	  WHERE PE.IDE_STATUS IN ('A') ");
				sqlConsultaAux1.append(" 		AND P.COD_FORM = ");
				sqlConsultaAux1.append(codFormConcentradora);
				sqlConsultaAux1.append(" 		AND PE.COD_ETAPA IN ( ");
				sqlConsultaAux1.append(codEtapaConcentradora);
				sqlConsultaAux1.append(" ) ");
				
				if ( !transferirRobo ) {
					sqlConsultaAux1.append(" 		  AND PE.COD_USUARIO_ETAPA IN ( ");
					sqlConsultaAux1.append(codUsuarioAutomatico);
					sqlConsultaAux1.append(" ) ");
				}
				
				sqlConsultaAux1.append("   ORDER BY PE.COD_PROCESSO, PE.COD_ETAPA, PE.COD_CICLO ");
	
				try (PreparedStatement pstConsultaAux1 = cnLecom.prepareStatement(sqlConsultaAux1.toString());
						 ResultSet rsConsultaAux1 = pstConsultaAux1.executeQuery();) {
				
					while (rsConsultaAux1.next()) {
						
						// Consulta as etapas do Paralelismo que ainda estão em aberto
						StringBuilder sqlConsultaAux2 = new StringBuilder();
						sqlConsultaAux2.append(" 	 SELECT COUNT(P.COD_PROCESSO) QTD_ETAPAS_ABERTO ");
						sqlConsultaAux2.append(" 	   FROM PROCESSO_ETAPA PE ");
						sqlConsultaAux2.append(" INNER JOIN PROCESSO P ON ( P.COD_PROCESSO = PE.COD_PROCESSO ) ");
						sqlConsultaAux2.append(" 	  WHERE PE.IDE_STATUS IN ('A') ");
						sqlConsultaAux2.append(" 		AND P.COD_PROCESSO = ");
						sqlConsultaAux2.append(rsConsultaAux1.getString("COD_PROCESSO"));
						sqlConsultaAux2.append(" 		AND PE.COD_ETAPA IN ( ");
						sqlConsultaAux2.append(codEtapasParalelismo);
						sqlConsultaAux2.append(" ) ");
//						sqlConsultaAux2.append("   ORDER BY PE.COD_PROCESSO, PE.COD_ETAPA, PE.COD_CICLO ");
		
						try (PreparedStatement pstConsultaAux2 = cnLecom.prepareStatement(sqlConsultaAux2.toString());
								 ResultSet rsConsultaAux2 = pstConsultaAux2.executeQuery();) {
						
							while (rsConsultaAux2.next()) {
								
								if (rsConsultaAux2.getInt("QTD_ETAPAS_ABERTO") == 0) {
									
									Integer codProcesso = rsConsultaAux1.getInt("COD_PROCESSO");
									Integer codEtapa = rsConsultaAux1.getInt("COD_ETAPA");
									Integer codCiclo = rsConsultaAux1.getInt("COD_CICLO");
									String modoTeste = rsConsultaAux1.getString("IDE_BETA_TESTE");
									
									if ( transferirRobo ) {
							    		if ( !verificaUsuarioProcessoEtapaUsu( cnLecom, codProcesso, codEtapa, codCiclo, codUsuarioAutomatico ) ) {
							    			inserirUsuarioEtapa ( cnLecom, base540, codProcesso, codEtapa, codCiclo, codUsuarioAutomatico );
							    		}
									}
									
									if ( formNovo ) {
										logger.info("APROVACOES - RETORNO FN : Proc / Etapa - ( " + codProcesso + " / " + codEtapa + " ) - " + executaAtividProcessoFormNovo(cnLecom, codProcesso.toString(), codEtapa.toString(), codCiclo.toString(), modoTeste, null, null, codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, paramAcaoAprovaRejeita, urlBPM, urlSSO));
									
									} else {
//										String valores = "OBSERVACAO|Processo aprovado automaticamente.";
										String valores = "";
										logger.info("PARALELO - RETORNO : Proc / Etapa - ( " + codProcesso + " / " + codEtapa + " ) - " + executaEtapaProcesso(rsConsultaAux1.getInt("COD_FORM"), codProcesso, codEtapa, codCiclo, valores, paramAcaoAprovaRejeita, loginUsuarioAutomatico, senhaUsuarioAutomatico));
									}
									
								}
							}
						}
					}
				}
			}
		}
		
		logger.info("FIM executaEtapaConcentradora");
	}
	
	
	/*
	 * Aprova/Rejeita etapas, definidas no propertie, paradas com o Robô
	 */
	private void executarAtividades( Connection cnLecom, String base540, boolean formNovo, String atividadesExecutar, Integer codUsuarioAutomatico, String loginUsuarioAutomatico, 
									 String senhaUsuarioAutomatico, String paramAcaoAprovaRejeita, String urlBPM, String urlSSO, boolean transferirRobo ) throws Exception{
		
		logger.info("INICIO aprovarEtapas");
		
		logger.info("atividadesExecutar : " + atividadesExecutar);
		
		if( !"".equals(atividadesExecutar) ){
		
			for (String atividadeExecut : atividadesExecutar.split(";")) {
				
				String[] paramFormEtapa = atividadeExecut.split("@");
				
				Integer codFormAnalise = new Integer(paramFormEtapa[0]);
				Integer codEtapaAnalise = new Integer(paramFormEtapa[1]);
				logger.info("PARAMETROS - Em analise - Form : " + codFormAnalise + " / Etapa : " + codEtapaAnalise);
	
				StringBuilder sqlConsultaEtapas = new StringBuilder();
				sqlConsultaEtapas.append(" 	   SELECT P.COD_FORM, PE.COD_PROCESSO, PE.COD_ETAPA, PE.COD_CICLO, P.IDE_BETA_TESTE ");
				sqlConsultaEtapas.append(" 		 FROM PROCESSO_ETAPA PE ");
				sqlConsultaEtapas.append(" INNER JOIN PROCESSO P ON ( P.COD_PROCESSO = PE.COD_PROCESSO ) ");
				sqlConsultaEtapas.append(" 		WHERE PE.IDE_STATUS IN ('A') ");
				sqlConsultaEtapas.append(" 		  AND P.COD_FORM = ");
				sqlConsultaEtapas.append(codFormAnalise);
				sqlConsultaEtapas.append(" 		  AND PE.COD_ETAPA IN ( ");
				sqlConsultaEtapas.append(codEtapaAnalise);
				sqlConsultaEtapas.append(" ) ");
				
				if ( !transferirRobo ) {
					sqlConsultaEtapas.append(" 		  AND PE.COD_USUARIO_ETAPA IN ( ");
					sqlConsultaEtapas.append(codUsuarioAutomatico);
					sqlConsultaEtapas.append(" ) ");
				}
				
				sqlConsultaEtapas.append("   ORDER BY PE.COD_PROCESSO, PE.COD_ETAPA, PE.COD_CICLO ");
				
				try (PreparedStatement pstConsultaEtapas = cnLecom.prepareStatement(sqlConsultaEtapas.toString());
						 ResultSet rsConsultaEtapas = pstConsultaEtapas.executeQuery();) {
				
					while (rsConsultaEtapas.next()) {
						
						Integer codProcesso = rsConsultaEtapas.getInt("COD_PROCESSO");
						Integer codEtapa = rsConsultaEtapas.getInt("COD_ETAPA");
						Integer codCiclo = rsConsultaEtapas.getInt("COD_CICLO");
						String modoTeste = rsConsultaEtapas.getString("IDE_BETA_TESTE");
						
						logger.info("Proc / Etapa : ( " + codProcesso + " / " + codEtapa + " ) ");
						
						if ( transferirRobo ) {
				    		if ( !verificaUsuarioProcessoEtapaUsu( cnLecom, codProcesso, codEtapa, codCiclo, codUsuarioAutomatico ) ) {
				    			inserirUsuarioEtapa ( cnLecom, base540, codProcesso, codEtapa, codCiclo, codUsuarioAutomatico );
				    		}
						}
						
						if ( formNovo ) {
							logger.info("APROVACOES - RETORNO FN : Proc / Etapa - ( " + codProcesso + " / " + codEtapa + " ) - " + executaAtividProcessoFormNovo(cnLecom, codProcesso.toString(), codEtapa.toString(), codCiclo.toString(), modoTeste, null, null, codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, paramAcaoAprovaRejeita, urlBPM, urlSSO));
						
						} else {
//							String valores = "OBSERVACAO|Processo aprovado automaticamente.";
							String valores = "";
							logger.info("APROVACOES - RETORNO : Proc / Etapa - ( " + codProcesso + " / " + codEtapa + " ) - " + executaEtapaProcesso(rsConsultaEtapas.getInt("COD_FORM"), codProcesso, codEtapa, codCiclo, valores, paramAcaoAprovaRejeita, loginUsuarioAutomatico, senhaUsuarioAutomatico));
						}
					}
				}
			}
		}
		
		logger.info("FIM aprovarEtapas");
	}
	
	
	/*
	 * Aprova/Rejeita etapas, cujo campo DATA ( nomeCampoAnalise ),for igual ou inferior a data atual
	 */
	private void executarAtividadesDataCampo( Connection cnLecom, String base540, boolean formNovo, Calendar datAtual, String execucaoDataCampo, Integer codUsuarioAutomatico, String loginUsuarioAutomatico, 
											  String senhaUsuarioAutomatico, String paramAcaoAprovaRejeita, String urlBPM, String urlSSO, boolean transferirRobo ) throws Exception{
		
		logger.info("INICIO executaEtapasDataCampo");
		logger.info("execucaoDataCampo : " + execucaoDataCampo);
		
		if( !"".equals(execucaoDataCampo) ){
		
			for (String paramExec : execucaoDataCampo.split(";")) {
				
				String[] paramFormEtapa = paramExec.split("@");
				
				Integer codFormAnalise = new Integer(paramFormEtapa[0]);
				Integer codEtapaAnalise = new Integer(paramFormEtapa[1]);
				String nomeCampoAnalise = paramFormEtapa[2];
				String nomeTabelaModelo = paramFormEtapa[3];
				logger.info("APROVACOES DATA CAMPO - Em analise - Form : " + codFormAnalise + " / Etapa : " + codEtapaAnalise + " / Campos : " + nomeCampoAnalise);
				
//				Map<String, String> paramFormModelo = Funcoes.getParametrosIntegracao(configPath + String.format("modelo_%1$s.properties", codFormAnalise));
//				String tableName = paramFormModelo.get("table_name");
			
				// Pega todos os processos que estão na etapa "Aguarda_data_modific" 
				StringBuilder sqlConsultaEtapas = new StringBuilder();
				sqlConsultaEtapas.append(" 	   SELECT P.COD_FORM, PE.COD_PROCESSO, PE.COD_ETAPA, PE.COD_CICLO, P.IDE_BETA_TESTE, F.");
				sqlConsultaEtapas.append(nomeCampoAnalise);
				sqlConsultaEtapas.append("	 	 FROM PROCESSO_ETAPA PE ");
				sqlConsultaEtapas.append(" INNER JOIN PROCESSO P ON ( P.COD_PROCESSO = PE.COD_PROCESSO ) ");
				sqlConsultaEtapas.append(" INNER JOIN ");
				sqlConsultaEtapas.append(nomeTabelaModelo);
				sqlConsultaEtapas.append(" F ON ( PE.COD_PROCESSO = F.COD_PROCESSO_F AND PE.COD_ETAPA = F.COD_ETAPA_F AND PE.COD_CICLO = F.COD_CICLO_F ) ");
				sqlConsultaEtapas.append("		WHERE PE.IDE_STATUS = 'A' ");
				sqlConsultaEtapas.append("  	  AND P.COD_FORM = ");
				sqlConsultaEtapas.append(codFormAnalise);
				sqlConsultaEtapas.append("  	  AND PE.COD_ETAPA = ");
				sqlConsultaEtapas.append(codEtapaAnalise);
				
				if ( !transferirRobo ) {
					sqlConsultaEtapas.append(" 		  AND PE.COD_USUARIO_ETAPA IN ( ");
					sqlConsultaEtapas.append(codUsuarioAutomatico);
					sqlConsultaEtapas.append(" ) ");
				}
				
				sqlConsultaEtapas.append("  AND F.");
				sqlConsultaEtapas.append(nomeCampoAnalise);
				sqlConsultaEtapas.append(" IS NOT NULL ");
		
	//			logger.info("sqlConsultaEtapas : " + sqlConsultaEtapas);
		
				try (PreparedStatement pstConsultaEtapas = cnLecom.prepareStatement(sqlConsultaEtapas.toString());
					 ResultSet rsConsultaEtapas = pstConsultaEtapas.executeQuery();) {
					
					while (rsConsultaEtapas.next()) {
						
						Integer codProcesso = rsConsultaEtapas.getInt("COD_PROCESSO");
						Integer codEtapa = rsConsultaEtapas.getInt("COD_ETAPA");
						Integer codCiclo = rsConsultaEtapas.getInt("COD_CICLO");
						String modoTeste = rsConsultaEtapas.getString("IDE_BETA_TESTE");
						Calendar datReferencia = DateToCalendar(rsConsultaEtapas.getDate(nomeCampoAnalise));
						
	//					logger.info("codProcesso : " + codProcesso);
	//					logger.info("codEtapa : " + codEtapa);
	//					logger.info("datReferencia : " + datReferencia);
						
						// Se a data Referencia for igual ou inferior a data atual, então executa
						if (datReferencia.compareTo(datAtual) <= 0) {
							
							if ( transferirRobo ) {
					    		if ( !verificaUsuarioProcessoEtapaUsu( cnLecom, codProcesso, codEtapa, codCiclo, codUsuarioAutomatico ) ) {
					    			inserirUsuarioEtapa ( cnLecom, base540, codProcesso, codEtapa, codCiclo, codUsuarioAutomatico );
					    		}
							}
							
							if ( formNovo ) {
								logger.info("APROVACOES - RETORNO FN : Proc / Etapa - ( " + codProcesso + " / " + codEtapa + " ) - " + executaAtividProcessoFormNovo(cnLecom, codProcesso.toString(), codEtapa.toString(), codCiclo.toString(), modoTeste, null, null, codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, paramAcaoAprovaRejeita, urlBPM, urlSSO));
							
							} else {
								String valores = "";
								logger.info("APROVACOES EXECUTA ETAPAS DATA CAMPO - RETORNO : Proc / Etapa - ( " + codProcesso + " / " + codEtapa + " ) - " + executaEtapaProcesso(rsConsultaEtapas.getInt("COD_FORM"), codProcesso, codEtapa, codCiclo, valores, paramAcaoAprovaRejeita, loginUsuarioAutomatico, senhaUsuarioAutomatico));
							}
						}
					}
				}
			}
		}
		
		logger.info("FIM executaEtapasDataCampo");
	}
	
	
	/*
	 * Aprova/Rejeita atividades cujo "prazo máximo", definido para ela, tenha excedido
	 */
	private void executarAtividadesPrazoMaximoExcedido( Connection cnLecom, String base540, boolean formNovo, Calendar datAtual, String paramProcExecutar, Integer codUsuarioAutomatico, 
												   		String loginUsuarioAutomatico, String senhaUsuarioAutomatico, String paramAcaoAprovaRejeita, String urlBPM, String urlSSO, boolean transferirRobo ) throws Exception{
		
		logger.info("INICIO aprovarEtapasPrazoMaximoExcedido");
		
		logger.info("aprovacoesEtapasPrazoMaximoExcedido : " + paramProcExecutar);
		
		if( !"".equals(paramProcExecutar) ){
		
			for (String paramProc : paramProcExecutar.split(";")) {
				
				String[] paramFormEtapa = paramProc.split("@");
				
				// <cod form>@<cod etapa>@<nome do campo onservaçao>@<mensagem para registrar execução automática>;
				Integer codFormAnalise = new Integer(paramFormEtapa[0]);
				Integer codEtapaAnalise = new Integer(paramFormEtapa[1]);
				String nomeCampoObservacao = "";
				String mensagemExecAutomatica = "";
				
				if( paramFormEtapa.length > 2 ){
					nomeCampoObservacao = paramFormEtapa[2];
					mensagemExecAutomatica = paramFormEtapa[3];
				}
				
				logger.info("APROVA ETAPAS PRAZO MAXIMO EXCEDIDO - Em analise - Form : " + codFormAnalise + " / Etapa : " + codEtapaAnalise + " / Campo Observação : " + nomeCampoObservacao + " / Mensagem : " + mensagemExecAutomatica);
	
				StringBuilder sqlConsultaAtividades = new StringBuilder();
				sqlConsultaAtividades.append(" 	   SELECT P.COD_FORM, PE.COD_PROCESSO, PE.COD_ETAPA, PE.COD_CICLO, E.COD_TIPO_ETAPA, PE.DAT_LIMITE, P.IDE_BETA_TESTE ");
				sqlConsultaAtividades.append(" 		 FROM PROCESSO_ETAPA PE ");
				sqlConsultaAtividades.append(" INNER JOIN PROCESSO P ON ( P.COD_PROCESSO = PE.COD_PROCESSO ) ");
				sqlConsultaAtividades.append(" INNER JOIN ETAPA E ON ( E.COD_FORM = P.COD_FORM AND E.COD_VERSAO = P.COD_VERSAO AND E.COD_ETAPA = PE.COD_ETAPA ) ");
				sqlConsultaAtividades.append(" 		WHERE PE.IDE_STATUS IN ('A') ");
				sqlConsultaAtividades.append(" 		  AND PE.DAT_LIMITE IS NOT NULL ");
				sqlConsultaAtividades.append(" 		  AND P.COD_FORM = ");
				sqlConsultaAtividades.append(codFormAnalise);
				sqlConsultaAtividades.append(" 		  AND PE.COD_ETAPA IN ( ");
				sqlConsultaAtividades.append(codEtapaAnalise);
				sqlConsultaAtividades.append(" ) ");
				
				if ( !transferirRobo ) {
					sqlConsultaAtividades.append(" 		  AND PE.COD_USUARIO_ETAPA IN ( ");
					sqlConsultaAtividades.append(codUsuarioAutomatico);
					sqlConsultaAtividades.append(" ) ");
				}
				
				sqlConsultaAtividades.append("   ORDER BY PE.COD_PROCESSO, PE.COD_ETAPA, PE.COD_CICLO ");
				
				logger.info("sqlConsultaAtividades : " + sqlConsultaAtividades);
				
				try ( PreparedStatement pstConsultaEtapas = cnLecom.prepareStatement(sqlConsultaAtividades.toString());
					  ResultSet rsConsultaEtapas = pstConsultaEtapas.executeQuery(); ) {
					
					while (rsConsultaEtapas.next()) {
						
						Integer codProcesso = rsConsultaEtapas.getInt("COD_PROCESSO");
						Integer codEtapa = rsConsultaEtapas.getInt("COD_ETAPA");
						Integer codCiclo = rsConsultaEtapas.getInt("COD_CICLO");
						String modoTeste = rsConsultaEtapas.getString("IDE_BETA_TESTE");
						//Calendar datReferencia = DateToCalendar(rsConsultaEtapas.getDate("DAT_LIMITE"));						
						Calendar datReferencia = TimestampToCalendar( rsConsultaEtapas.getTimestamp("DAT_LIMITE") );
						
						logger.info("data referencia SEM CONVERCAO: " + rsConsultaEtapas.getTimestamp("DAT_LIMITE"));
						logger.info("data referencia: " + datReferencia);
						logger.info("data Hoje:" + datAtual);
						
						// Se o tipo da etapa for 1 = Inicial, a açaõ precisa ser de cancelamento
						Integer codTipoEtapa = rsConsultaEtapas.getInt("COD_TIPO_ETAPA");
						if ( "R".equalsIgnoreCase(paramAcaoAprovaRejeita) && codTipoEtapa.compareTo(new Integer(1)) == 0 ){
							paramAcaoAprovaRejeita = "C";
							logger.info("nova ação : " + paramAcaoAprovaRejeita);
						}
						
						logger.info("codProcesso : " + codProcesso);
						logger.info("codEtapa : " + codEtapa);
						logger.info("datReferencia : " + datReferencia);
						
						// Se a data Referencia for igual ou inferior a data atual, então executa
						if (datReferencia.compareTo(datAtual) <= 0) {
							
							if ( transferirRobo ) {
					    		if ( !verificaUsuarioProcessoEtapaUsu( cnLecom, codProcesso, codEtapa, codCiclo, codUsuarioAutomatico ) ) {
					    			inserirUsuarioEtapa ( cnLecom, base540, codProcesso, codEtapa, codCiclo, codUsuarioAutomatico );
					    		}
							}
							
							if( formNovo ) {
								
								Map<String,String> camposValores = new HashMap<String, String>();
								
								if( !"".equals(nomeCampoObservacao) ) {
									camposValores.put(nomeCampoObservacao, mensagemExecAutomatica);
								}
								logger.info("APROVACOES - RETORNO FN : Proc / Etapa - ( " + codProcesso + " / " + codEtapa + " ) - " + executaAtividProcessoFormNovo(cnLecom, codProcesso.toString(), codEtapa.toString(), codCiclo.toString(), modoTeste, camposValores, null, codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, paramAcaoAprovaRejeita, urlBPM, urlSSO));
							
							} else {
								
								String valores = "";
								
								if( !"".equals(nomeCampoObservacao) ) {
									valores = nomeCampoObservacao + "|" + mensagemExecAutomatica;
								}
								
								logger.info("APROVACOES EXECUTA ETAPAS DATA CAMPO - RETORNO : Proc / Etapa - ( " + codProcesso + " / " + codEtapa + " ) - " + executaEtapaProcesso(rsConsultaEtapas.getInt("COD_FORM"), codProcesso, codEtapa, codCiclo, valores, paramAcaoAprovaRejeita, loginUsuarioAutomatico, senhaUsuarioAutomatico));
							}
						}
					}
				}				
			}
		}
		
		logger.info("FIM aprovarEtapasPrazoMaximoExcedido");
	}
	
	
	private static Calendar DateToCalendar(Date date){
		logger.info("INICIO DateToCalendar");
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		
		logger.info("FIM DateToCalendar");
		
		return cal;
	}
	
	
	private static Calendar TimestampToCalendar(Timestamp timestamp){
		logger.info("INICIO TimestampToCalendar");
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(timestamp);
		
		logger.info("FIM TimestampToCalendar");
		
		return cal;
	}
	
	
	private boolean verificaUsuarioProcessoEtapaUsu (Connection cnLecom, Integer codProcesso, Integer codEtapa, Integer codCiclo, Integer codUsuario ) throws Exception {

		StringBuilder sql = new StringBuilder();
		sql.append(" SELECT COUNT(*) AS total ");
		sql.append("   FROM processo_etapa_usu ");
		sql.append("  WHERE cod_processo      = ? ");
		sql.append("    AND cod_etapa         = ? ");
		sql.append("    AND cod_ciclo         = ? ");
		sql.append("    AND cod_usuario_etapa = ? ");

		try (PreparedStatement pst = cnLecom.prepareStatement(sql.toString())) {
			pst.setInt(1, codProcesso);
			pst.setInt(2, codEtapa);
			pst.setInt(3, codCiclo);
			pst.setInt(4, codUsuario);

			try (ResultSet rs = pst.executeQuery()) {
				if (rs.next()) {
					int total = rs.getInt("total");

					if (total > 0) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			}
		}
	}
	
	
	// Insere o Usuário Robo na atividade para poder executa-la.
	private void inserirUsuarioEtapa(Connection cnLecom, String base540, Integer codProcesso, Integer codEtapa, Integer codCiclo, Integer codUsuario ) throws Exception {

		logger.info("[=== INICIO inserirUsuarioEtapa ===]");
		
		StringBuilder processoEtapaUsu = new StringBuilder();
		
		if( "S".equalsIgnoreCase(base540)) {
		
			processoEtapaUsu.append(" INSERT INTO PROCESSO_ETAPA_USU ( COD_PROCESSO, COD_ETAPA, COD_CICLO, COD_USUARIO_ETAPA, VISUALIZED ) ");
			processoEtapaUsu.append(" VALUES ( ?, ?, ?, ?, 0 ) ");
		
		} else {
			processoEtapaUsu.append(" INSERT INTO PROCESSO_ETAPA_USU ( COD_PROCESSO, COD_ETAPA, COD_CICLO, COD_USUARIO_ETAPA, IDE_VISUALIZADO ) ");
			processoEtapaUsu.append(" VALUES ( ?, ?, ?, ?, 'N' ) ");
		}
		
		try(PreparedStatement pstInsert = cnLecom.prepareStatement(processoEtapaUsu.toString())) {

			pstInsert.setInt(1, codProcesso);
			pstInsert.setInt(2, codEtapa);
			pstInsert.setInt(3, codCiclo);
			pstInsert.setInt(4, codUsuario);

			pstInsert.executeUpdate();
			cnLecom.commit();

		} catch (Exception e) {
			logger.error("[ERRO - inserirRoboEtapa]", e);
		}

		logger.info("[=== FIM inserirUsuarioEtapa ===]");
	}
	
	
	// cancela processos que estão na atividade inicial, ciclo 1, parados a mais de x dias
	private void cancelaProcessoNaoEnviado( Connection cnLecom, String base540, LocalDate dataAtual, String atividadesExecutar, Integer codUsuarioAutomatico, String loginUsuarioAutomatico, 
			String senhaUsuarioAutomatico, String urlBPM, String urlSSO, boolean transferirRobo ) throws Exception {

		logger.info("INICIO cancelaProcessoNaoEnviado");
		
		logger.info("atividadesExecutar : " + atividadesExecutar);
		
		if( !"".equals(atividadesExecutar) ){
			
			for ( String atividadeExecut : atividadesExecutar.split(";") ) {
				
				String[] paramFormEtapa = atividadeExecut.split("@");
				
				Integer codFormAnalise = new Integer(paramFormEtapa[0]);
				String qtdDiasAguardar = paramFormEtapa[1];
				
				configGlobalCancelaProcessosEtpInicial(cnLecom, base540, dataAtual, codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, urlBPM, urlSSO, transferirRobo, codFormAnalise, qtdDiasAguardar);
			}
		}
		
		logger.info("FIM cancelaProcessoNaoEnviado");
	}

	
	// configuraçâo global : finaliza todos os processos que estão na atividade final, parados a mais de x dias
	private void configGlobalCancelaProcessosEtpInicial(Connection cnLecom, String base540, LocalDate dataAtual, Integer codUsuarioAutomatico,
														String loginUsuarioAutomatico, String senhaUsuarioAutomatico, String urlBPM, String urlSSO,
														boolean transferirRobo, Integer codFormAnalise, String qtdDiasAguardar) throws SQLException, Exception {
		
		Integer auxQtdDiasAguardar = new Integer(qtdDiasAguardar);
		int iQtdDiasAguardar = -auxQtdDiasAguardar; // Deixa o numero negativo
		
		logger.info("PARAMETROS - Em analise - Form : " + codFormAnalise + " / qtdDiasAguardar : " + qtdDiasAguardar);
		
		if( auxQtdDiasAguardar.compareTo(new Integer(0)) > 0 ) {

			StringBuilder sqlConsultaEtapas = new StringBuilder();
			sqlConsultaEtapas.append(" 	   SELECT P.COD_FORM, PE.COD_PROCESSO, PE.COD_ETAPA, PE.COD_CICLO, P.IDE_BETA_TESTE, PE.DAT_GRAVACAO ");
			sqlConsultaEtapas.append(" 		 FROM PROCESSO_ETAPA PE ");
			sqlConsultaEtapas.append(" INNER JOIN PROCESSO P ON ( P.COD_PROCESSO = PE.COD_PROCESSO ) ");
			sqlConsultaEtapas.append(" INNER JOIN ETAPA E ON ( E.COD_FORM = P.COD_FORM AND E.COD_VERSAO = P.COD_VERSAO AND E.COD_ETAPA = PE.COD_ETAPA ) ");
			sqlConsultaEtapas.append(" 		WHERE PE.IDE_STATUS = 'A' ");
			sqlConsultaEtapas.append(" 		  AND PE.IDE_TEMPORARIO = 'N' ");
			sqlConsultaEtapas.append(" 		  AND E.COD_TIPO_ETAPA = 1 ");
			sqlConsultaEtapas.append(" 		  AND PE.COD_CICLO = 1 ");

			// Se estiver definido código de formulário, caso não pega todos os formulários
			if( codFormAnalise != null && codFormAnalise.compareTo( new Integer(0) ) > 0 ) {
				sqlConsultaEtapas.append(" 		  AND P.COD_FORM = ");
				sqlConsultaEtapas.append(codFormAnalise);
			}

			sqlConsultaEtapas.append("   ORDER BY PE.COD_PROCESSO, PE.COD_ETAPA, PE.COD_CICLO ");

			try ( PreparedStatement pstConsultaEtapas = cnLecom.prepareStatement(sqlConsultaEtapas.toString() );
					ResultSet rsConsultaEtapas = pstConsultaEtapas.executeQuery(); ) {

				while (rsConsultaEtapas.next()) {

					Integer codProcesso = rsConsultaEtapas.getInt("COD_PROCESSO");
					Integer codEtapa = rsConsultaEtapas.getInt("COD_ETAPA");
					Integer codCiclo = rsConsultaEtapas.getInt("COD_CICLO");
					String modoTeste = rsConsultaEtapas.getString("IDE_BETA_TESTE");
					// Calendar dataAbertura = DateToCalendar(rsConsultaEtapas.getDate("DAT_GRAVACAO"));
					LocalDateTime dataInicioAtividade = LocalDateTime.parse( rsConsultaEtapas.getString("DAT_GRAVACAO") , DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S"));
					logger.info("dataInicioAtividade : " + dataInicioAtividade);

					// Calcula a diferença de dias entre as duas datas ( Se a qtd vier negativa, quer dizer q a data Analisada é inferior a atual, se for positiva, a data analisada é superior a atual )
					long difEmDiasDataAbertura = ChronoUnit.DAYS.between(dataAtual, dataInicioAtividade);
					logger.info("codProcesso / difEmDiasDataAbertura : " + codProcesso + " / " + difEmDiasDataAbertura);

					// Se a data Referencia for igual ou inferior a data atual, então executa
					if( iQtdDiasAguardar > difEmDiasDataAbertura ) {

						if ( transferirRobo ) {
							if ( !verificaUsuarioProcessoEtapaUsu( cnLecom, codProcesso, codEtapa, codCiclo, codUsuarioAutomatico ) ) {
								inserirUsuarioEtapa ( cnLecom, base540, codProcesso, codEtapa, codCiclo, codUsuarioAutomatico );
							}
						}

						logger.info("CANCELA PROCESSO - RETORNO FN : Proc / Etapa - ( " + codProcesso + " / " + codEtapa + " ) - " + cancelaProcessoFormNovo(cnLecom, codProcesso.toString(), codEtapa.toString(), codCiclo.toString(), modoTeste, codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, urlBPM, urlSSO));

					} else {
						logger.debug("Aguardar!");
					}

				}
			}
			
		} else {
			logger.info("Não será realizada cancelamento de processos, pois tempo qtdDiasAguardar <= 0");
		}
	}
	
	
	private void configGlobalFinalizaProcessosEtpFinal(Connection cnLecom, String base540, LocalDate dataAtual, Integer codUsuarioAutomatico,
														String loginUsuarioAutomatico, String senhaUsuarioAutomatico, String urlBPM, String urlSSO,
														boolean transferirRobo, Integer codFormAnalise, String qtdDiasAguardar) throws SQLException, Exception {

		Integer auxQtdDiasAguardar = new Integer(qtdDiasAguardar);
		int iQtdDiasAguardar = -auxQtdDiasAguardar; // Deixa o numero negativo
		
		logger.info("PARAMETROS - Em analise - Form : " + codFormAnalise + " / qtdDiasAguardar : " + qtdDiasAguardar);
		
		if( auxQtdDiasAguardar.compareTo(new Integer(0)) > 0 ) {

			StringBuilder sqlConsultaEtapas = new StringBuilder();
			sqlConsultaEtapas.append(" 	   SELECT P.COD_FORM, PE.COD_PROCESSO, PE.COD_ETAPA, PE.COD_CICLO, P.IDE_BETA_TESTE, PE.DAT_GRAVACAO ");
			sqlConsultaEtapas.append(" 		 FROM PROCESSO_ETAPA PE ");
			sqlConsultaEtapas.append(" INNER JOIN PROCESSO P ON ( P.COD_PROCESSO = PE.COD_PROCESSO ) ");
			sqlConsultaEtapas.append(" INNER JOIN ETAPA E ON ( E.COD_FORM = P.COD_FORM AND E.COD_VERSAO = P.COD_VERSAO AND E.COD_ETAPA = PE.COD_ETAPA ) ");
			sqlConsultaEtapas.append(" 		WHERE PE.IDE_STATUS = 'A' ");
	//		sqlConsultaEtapas.append(" 		  AND PE.IDE_TEMPORARIO = 'N' ");
			sqlConsultaEtapas.append(" 		  AND E.COD_TIPO_ETAPA = 2 ");
	//		sqlConsultaEtapas.append(" 		  AND PE.COD_CICLO = 1 ");
	
			// Se estiver definido código de formulário, caso não pega todos os formulários
			if( codFormAnalise != null && codFormAnalise.compareTo( new Integer(0) ) > 0 ) {
				sqlConsultaEtapas.append(" 		  AND P.COD_FORM = ");
				sqlConsultaEtapas.append(codFormAnalise);
			}
	
			sqlConsultaEtapas.append("   ORDER BY PE.COD_PROCESSO, PE.COD_ETAPA, PE.COD_CICLO ");
	
			try ( PreparedStatement pstConsultaEtapas = cnLecom.prepareStatement(sqlConsultaEtapas.toString() );
					ResultSet rsConsultaEtapas = pstConsultaEtapas.executeQuery(); ) {
	
				while (rsConsultaEtapas.next()) {
	
					Integer codProcesso = rsConsultaEtapas.getInt("COD_PROCESSO");
					Integer codEtapa = rsConsultaEtapas.getInt("COD_ETAPA");
					Integer codCiclo = rsConsultaEtapas.getInt("COD_CICLO");
					String modoTeste = rsConsultaEtapas.getString("IDE_BETA_TESTE");
					//Calendar dataAbertura = DateToCalendar(rsConsultaEtapas.getDate("DAT_GRAVACAO"));
					LocalDateTime dataInicioAtividade = LocalDateTime.parse( rsConsultaEtapas.getString("DAT_GRAVACAO") , DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S"));
					logger.info("dataInicioAtividade : " + dataInicioAtividade);
	
					// Calcula a diferença de dias entre as duas datas ( Se a qtd vier negativa, quer dizer q a data Analisada é inferior a atual, se for positiva, a data analisada é superior a atual )
					long difEmDiasDataAbertura = ChronoUnit.DAYS.between(dataAtual, dataInicioAtividade);
					logger.info("codProcesso / difEmDiasDataAbertura : " + codProcesso + " / " + difEmDiasDataAbertura);
	
					// Se a data Referencia for igual ou inferior a data atual, então executa
					if( iQtdDiasAguardar > difEmDiasDataAbertura ) {
	
						if ( transferirRobo ) {
							if ( !verificaUsuarioProcessoEtapaUsu( cnLecom, codProcesso, codEtapa, codCiclo, codUsuarioAutomatico ) ) {
								inserirUsuarioEtapa ( cnLecom, base540, codProcesso, codEtapa, codCiclo, codUsuarioAutomatico );
							}
						}
	
						logger.info("EXECUTA ETAPAS FINAIS - RETORNO FN : Proc / Etapa - ( " + codProcesso + " / " + codEtapa + " ) - " + executaAtividProcessoFormNovo(cnLecom, codProcesso.toString(), codEtapa.toString(), codCiclo.toString(), modoTeste, null, null, codUsuarioAutomatico, loginUsuarioAutomatico, senhaUsuarioAutomatico, "P", urlBPM, urlSSO));
	
					} else {
						logger.debug("Aguardar!");
					}
	
				}
			}
			
		} else {
			logger.info("Não será realizada a finalização de processos, pois tempo qtdDiasAguardar <= 0");
		}
	}
	
	@Override
	public List<WebServicesVO> getWebServices() {
		return null;
	}

	@Override
	public void setWebServices(WebServicesVO arg0) {
	}
}
