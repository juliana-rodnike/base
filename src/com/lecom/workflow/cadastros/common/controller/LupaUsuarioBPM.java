package com.lecom.workflow.cadastros.common.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.simple.JSONArray;

import com.lecom.tecnologia.db.DBUtils;
import com.lecom.workflow.cadastros.common.util.Funcoes;

import br.com.lecom.atos.utils.view.ControllerServlet;

//@WebServlet("/apex/LupaUsuarioBPM")
@WebServlet("/app/public/LupaUsuarioBPM")
public class LupaUsuarioBPM extends ControllerServlet{
	
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(LupaUsuarioBPM .class);

	@SuppressWarnings("unchecked")
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		logger.info("> LupaFuncionarios - INICIO");
		System.out.println("> LupaFuncionarios - INICIO");
		
		JSONObject retorno = new JSONObject();
		
		String nome = Funcoes.nulo(request.getParameter("nome"), "");
		logger.info("LupaFuncionarios - nome : " + nome + " - nome.length() : " + nome.length());
		System.out.println("LupaFuncionarios - nome : " + nome + " - nome.length() : " + nome.length());
		
		String senha = Funcoes.nulo(request.getParameter("senha"), "");
//		logger.info("LupaFuncionarios - senha : " + senha);
//		System.out.println("LupaFuncionarios - senha : " + senha);
		
		try {
			
			Map<String,String> parametrosLupa = Funcoes.getParametrosIntegracao(Funcoes.getWFRootDir() + "/upload/cadastros/config/paramLupa");
			String senhaLupa = parametrosLupa.get("senhaLupa");
//			logger.info("LupaFuncionarios - senhaLupa : " + senhaLupa);
//			System.out.println("LupaFuncionarios - senhaLupa : " + senhaLupa);
			
			JSONArray collect = new JSONArray();
			
			// Se o nome estiver em branco ou a senha for errada, não retorna nada
//			if( !"".equals(nome) && nome.length() >= 3 && senhaLupa.equals(senha) ) {
			if( senhaLupa.equals(senha) ) {
			
				try ( Connection cnBPM = DBUtils.getConnection("workflow") ) {
					
					StringBuilder sSql = new StringBuilder();
					
					sSql.append(" SELECT U.COD_USUARIO, U.NOM_USUARIO, U.DES_EMAIL, U.DES_LOGIN, U.COD_LIDER, ");
					sSql.append("		 U2.NOM_USUARIO NOME_LIDER, U2.DES_EMAIL EMAIL_LIDER, U2.DES_LOGIN LOGIN_LIDER, U.COD_DEPTO, D.DES_COMANDO COMANDO_DEPTO, ");
					sSql.append("		 D.DES_DEPTO DEPTO, U.LOGRADOURO, U.NUMERO, U.COMPLEMENTO, U.CODIGO_POSTAL, ");
					sSql.append("		 U.CIDADE, U.UF, U.TELEFONE, U.CELULAR ");
					sSql.append("   FROM USUARIO U ");
					sSql.append("   JOIN USUARIO U2 ON (U.COD_LIDER = U2.COD_USUARIO) ");
					sSql.append("   JOIN DEPTO D ON (U.COD_DEPTO = D.COD_DEPTO) ");
					sSql.append("  WHERE U.COD_USUARIO > 3 ");
					sSql.append("    AND UPPER(U.NOM_USUARIO) LIKE UPPER('%");
					sSql.append(nome);
					sSql.append("%') ");
					sSql.append(" ORDER BY U.NOM_USUARIO ");
	
					try(PreparedStatement pst = cnBPM.prepareStatement(sSql.toString())){
						
						try(ResultSet rs = pst.executeQuery()){
							
							while(rs.next()){
								
								JSONObject jsonObject = new JSONObject();
								
								try {
									
									// Monta o Endereço Completo
									StringBuilder enderCompleto = new StringBuilder();
									enderCompleto.append(Funcoes.nulo(rs.getString("LOGRADOURO"), ""));
									enderCompleto.append(", ");
									enderCompleto.append(Funcoes.nulo(rs.getString("NUMERO"), ""));
									enderCompleto.append(" - ");
									
									if( !"".equals( Funcoes.nulo(rs.getString("COMPLEMENTO"), "") ) ){
										enderCompleto.append(Funcoes.nulo(rs.getString("COMPLEMENTO"), ""));
										enderCompleto.append(" - ");	
									}
									
									enderCompleto.append(Funcoes.nulo(rs.getString("CODIGO_POSTAL"), ""));
									enderCompleto.append(" - ");
									enderCompleto.append(Funcoes.nulo(rs.getString("CIDADE"), ""));
									enderCompleto.append(" - ");
									enderCompleto.append(Funcoes.nulo(rs.getString("UF"), ""));
									
									jsonObject.put("COD_USUARIO", rs.getString("COD_USUARIO"));
									jsonObject.put("NOME_USUARIO", rs.getString("NOM_USUARIO"));
									jsonObject.put("EMAIL", rs.getString("DES_EMAIL"));
									jsonObject.put("LOGIN", rs.getString("DES_LOGIN"));
									jsonObject.put("COD_LIDER", rs.getString("COD_LIDER"));
									
									jsonObject.put("NOME_LIDER", rs.getString("NOME_LIDER"));
									jsonObject.put("EMAIL_LIDER", rs.getString("EMAIL_LIDER"));
									jsonObject.put("LOGIN_LIDER", rs.getString("LOGIN_LIDER"));
									jsonObject.put("COD_DEPTO", rs.getString("COD_DEPTO"));
									jsonObject.put("COMANDO_DEPTO", rs.getString("COMANDO_DEPTO"));
									
									jsonObject.put("DEPTO", rs.getString("DEPTO"));
									jsonObject.put("LOGRADOURO", rs.getString("LOGRADOURO"));
									jsonObject.put("NUMERO", rs.getString("NUMERO"));
									jsonObject.put("COMPLEMENTO", rs.getString("COMPLEMENTO"));
									jsonObject.put("CODIGO_POSTAL", rs.getString("CODIGO_POSTAL"));
									
									jsonObject.put("CIDADE", rs.getString("CIDADE"));
									jsonObject.put("UF", rs.getString("UF"));
									jsonObject.put("TELEFONE", rs.getString("TELEFONE"));
									jsonObject.put("CELULAR", rs.getString("CELULAR"));
									jsonObject.put("ENDERECO_PESSOAL_COMPLETO", enderCompleto.toString());
									
									logger.info("LupaFuncionarios - jsonObject : " + jsonObject);
									System.out.println("LupaFuncionarios - jsonObject : " + jsonObject);
									
								} catch (JSONException e) {
									
									logger.error("LupaFuncionarios - jsonObject : ", e);
									System.out.println("LupaCEP - jsonObject : " + Funcoes.exceptionPrinter(e));
								}
								
								collect.add(jsonObject);
							}
						}
					}
				}
				
			} else {
				
				logger.info("Retorno Vazio pois !\"\".equals(nome) && nome.length() >= 3 && senhaLupa.equals(senha)");
				System.out.println("Retorno Vazio pois !\"\".equals(nome) && nome.length() >= 3 && senhaLupa.equals(senha)");
			}
			
			retorno.put("dados", collect);
			
		} catch (SQLException e) {
			
			logger.error("LupaFuncionarios - geral SQLException : ", e);
			System.out.println("LupaFuncionarios - geral SQLException : " + Funcoes.exceptionPrinter(e));
			
		} catch (JSONException e) {
			
			logger.error("LupaFuncionarios - geral JSONException : ", e);
			System.out.println("LupaFuncionarios - geral JSONException : " + Funcoes.exceptionPrinter(e));

		} catch (Exception e) {
			
			logger.error("LupaFuncionarios - geral Exception : ", e);
			System.out.println("LupaFuncionarios - geral Exception : " + Funcoes.exceptionPrinter(e));
		}
		
		logger.info("> LupaFuncionarios - FIM");
		System.out.println("> LupaFuncionarios - FIM");
		
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.print(retorno.toString());
	}
	
}
