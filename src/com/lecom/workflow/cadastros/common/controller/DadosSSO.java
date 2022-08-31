package com.lecom.workflow.cadastros.common.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.lecom.workflow.cadastros.common.util.Funcoes;

import br.com.lecom.atos.utils.view.ControllerServlet;

@WebServlet("/app/dadosSSO")
public class DadosSSO extends ControllerServlet {
	
	private static final Logger logger = Logger.getLogger(DadosSSO.class);
	private static final long serialVersionUID = 1L;

	@SuppressWarnings("unchecked")
	public void getDadosTicket(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		logger.info("Inicio getDadosTicket");

		JSONObject retorno = new JSONObject();
		HttpResponse httpResponse = null;
		
		String protocolo = com.lecom.workflow.cadastros.common.util.Funcoes.nulo(request.getParameter("protocolo"), "");
		logger.info("protocolo: " + protocolo);
		
		String hostname = Funcoes.nulo(request.getParameter("hostname"), "");
		logger.info("hostname: " + hostname);
		
		String ticket = Funcoes.nulo(request.getParameter("ticket"), "");
		logger.info("ticket" + ticket);
		
		try (CloseableHttpClient httpClient = HttpClientBuilder.create().build()) {

			// location.protocol + "//" + location.hostname+"/sso/api/v1/tickets/"+ticket,
			StringBuilder url = new StringBuilder();
			url.append(protocolo);
			url.append("//");
			url.append(hostname);
			url.append("/sso/api/v1/tickets/");
			url.append(ticket);
			
			HttpGet httpGet = new HttpGet(url.toString());
			httpGet.addHeader("Content-Type", "application/json");
			
			httpResponse = httpClient.execute(httpGet);

			int code = httpResponse.getStatusLine().getStatusCode();

			if (code == 200) {
				String jsonString = EntityUtils.toString(httpResponse.getEntity());

				if(!"".equals(jsonString)) {
					JSONParser parser = new JSONParser();
					
					Object obj = parser.parse(jsonString);
					JSONObject jsonObject = (JSONObject) obj;
					
					Object objContent = parser.parse(jsonObject.get("content").toString());
					retorno = (JSONObject) objContent;
				}

			} else {
				retorno.put("erro", httpResponse.getStatusLine().getStatusCode() + " : Erro ao consultar ticket");
			}

		} catch (Exception e) {
			e.printStackTrace();
			retorno.put("erro", "Erro: " + Funcoes.exceptionPrinter(e));
		
		} finally{
			response.setContentType("application/json");
			PrintWriter out = response.getWriter();
			out.print(retorno.toString());
		}
	}
	
}

