package com.lecom.workflow.cadastros.common.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.simple.JSONObject;

import com.lecom.workflow.cadastros.common.util.Funcoes;

import br.com.lecom.api.exception.UniqueIdInvalidoException;
import br.com.lecom.api.exception.VerificaAssinaturaDocumentoException;
import br.com.lecom.api.factory.ECMFactory;
import br.com.lecom.atos.utils.view.ControllerServlet;

@WebServlet("/app/consultaDocumentosAssinados")
public class ConsultaDocumentos extends ControllerServlet {
	
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(ConsultaDocumentos.class);
	
	public ConsultaDocumentos() {
		super();
	}
	
	@SuppressWarnings("unchecked")
	public void validaDocumentoAssinado(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, VerificaAssinaturaDocumentoException, UniqueIdInvalidoException {
		JSONObject retorno = new JSONObject();
		String uniqueId = Funcoes.nulo(request.getParameter("uniqueId"), "");
		boolean documentoAssinado = false;
		
		try {
			logger.info("uniqueId: "+ uniqueId);
			System.out.println("uniqueId: "+ uniqueId);
//			System.out.println("consultaDocumentosAssinados -> validaDocumentoAssinado -> uniqueId : " + uniqueId);
			
			if( !"".equals(uniqueId) ){
				documentoAssinado = ECMFactory.documento().verificarSeDocumentoEstaAssinado(uniqueId);
			}
			
			logger.info("documentoAssinado: "+ documentoAssinado);
			System.out.println("documentoAssinado: "+ documentoAssinado);
//			System.out.println("consultaDocumentosAssinados -> validaDocumentoAssinado -> documentoAssinado : " + documentoAssinado);
			
			if(documentoAssinado){
				retorno.put("sucesso", "true");
			}

		} catch (Exception e) {
			logger.error("Erro ao consultar a Endereco: ", e);
			System.out.println("Erro ao consultar a Endereco: " + Funcoes.exceptionPrinter(e));
//			System.out.println("consultaDocumentosAssinados -> validaDocumentoAssinado -> Erro ao consultar a Endereco : " + Funcoes.exceptionPrinter(e));
			retorno.put("erro", "Erro ao consultar a Endereco : " + Funcoes.exceptionPrinter(e));
	    }
		
//		System.out.println("consultaDocumentosAssinados -> validaDocumentoAssinado -> retorno : " + retorno);
		
	    response.setContentType("application/json");
	    PrintWriter out = response.getWriter();
	    out.print(retorno.toString());
	}
	
	@SuppressWarnings("unchecked")
	public void validaDocumentoAssinadoPorUsuario(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, VerificaAssinaturaDocumentoException, UniqueIdInvalidoException {
		JSONObject retorno = new JSONObject();
//		JSONArray usuarioAssinadores = new JSONArray();
		String uniqueId = Funcoes.nulo(request.getParameter("uniqueId"), "");
		String usuario = Funcoes.nulo(request.getParameter("usuario"), "");
		
		boolean documentoAssinado = false;
		boolean usuarioAssinou = false;
		StringBuilder loginAssinadores = new StringBuilder();
		
		try {
			logger.info("uniqueId: "+ uniqueId);
			System.out.println("uniqueId: "+ uniqueId);
			
			logger.info("usuario: "+ usuario);
			System.out.println("usuario: "+ usuario);
//			System.out.println("consultaDocumentosAssinados -> validaDocumentoAssinado -> uniqueId : " + uniqueId);
			
			if( !"".equals(uniqueId) ){
				documentoAssinado = ECMFactory.documento().verificarSeDocumentoEstaAssinado(uniqueId);
				String[] assinadores = ECMFactory.documento().obterUsuariosQueAssinaramArquivo(uniqueId);
				
				for (String assinador : assinadores) {
					
					// Isso foi necessário pois a API está trazendo "##DOT##", no lugar de ponto
					assinador = assinador.replaceAll("##DOT##", ".");
					
					logger.info("assinador : " + assinador);
					System.out.println("assinador : " + assinador);
					
					loginAssinadores.append(assinador);
					loginAssinadores.append(", ");
//					usuarioAssinadores.put(assinador);
					
					if( assinador.equalsIgnoreCase(usuario) ) {
						usuarioAssinou = true;
					}
				}
				
				loginAssinadores.delete(loginAssinadores.length()-2, loginAssinadores.length());
				System.out.println("assinadores : " + assinadores);
			}
			
			logger.info("documentoAssinado: "+ documentoAssinado + " - usuarioAssinou : " + usuarioAssinou + " - usuarioAssinadores : " + loginAssinadores);
			System.out.println("documentoAssinado: "+ documentoAssinado + " - usuarioAssinou : " + usuarioAssinou + " - usuarioAssinadores : " + loginAssinadores);
			
//			logger.info("documentoAssinado: "+ documentoAssinado + " - usuarioAssinou : " + usuarioAssinou + " - usuarioAssinadores : " + usuarioAssinadores.toString());
//			System.out.println("documentoAssinado: "+ documentoAssinado + " - usuarioAssinou : " + usuarioAssinou + " - usuarioAssinadores : " + usuarioAssinadores.toString());
//			System.out.println("consultaDocumentosAssinados -> validaDocumentoAssinado -> documentoAssinado : " + documentoAssinado);
			
			if( documentoAssinado && usuarioAssinou ){
				retorno.put("sucesso", "true");
			}

		} catch (Exception e) {
			logger.error("Erro ao consultar a Endereco: ", e);
			System.out.println("Erro ao consultar a Endereco: " + Funcoes.exceptionPrinter(e));
//			System.out.println("consultaDocumentosAssinados -> validaDocumentoAssinado -> Erro ao consultar a Endereco : " + Funcoes.exceptionPrinter(e));
			retorno.put("erro", "Erro ao consultar a Endereco : " + Funcoes.exceptionPrinter(e));
	    }
		
//		System.out.println("consultaDocumentosAssinados -> validaDocumentoAssinado -> retorno : " + retorno);
		
	    response.setContentType("application/json");
	    PrintWriter out = response.getWriter();
	    out.print(retorno.toString());
	}
}