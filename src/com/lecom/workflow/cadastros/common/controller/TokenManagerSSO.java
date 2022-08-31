package com.lecom.workflow.cadastros.common.controller;

import java.sql.Connection;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.lecom.workflow.cadastros.common.model.Token;
import com.lecom.workflow.cadastros.rotas.LoginAutenticacao;
import com.lecom.workflow.cadastros.rotas.exception.LoginAuthenticationException;
import com.lecom.workflow.cadastros.rotas.util.DadosLogin;
import com.lecom.workflow.cadastros.common.util.Funcoes;

public class TokenManagerSSO {
	
	private static TokenManagerSSO instance;
	private static Map<String, Token> tokenMap;
	
	
	private TokenManagerSSO() {
	}

	
	public static TokenManagerSSO getInstance(){

		if(instance == null){
			instance = new TokenManagerSSO();
			tokenMap = new HashMap<>();
		}

		return instance;
	}

	
	public Token getAccessToken(Logger logger, Connection cnLecom, String urlSSO, String login, String senha) throws Exception {
		
		Token token = null;
		
		if (login != null) {
			token = tokenMap.get(login);
		}
		
		if (token == null || isTokenExpired(token.getValidadeToken())) {
			
			if( urlSSO != null && !"".equals(urlSSO) ) {
				
				token = generateTokenArquivo(logger, cnLecom, urlSSO, login, senha);
				tokenMap.put(login, token);
				
			} else {
				
				token = generateTokenBanco(logger, cnLecom, login, senha);
				tokenMap.put(login, token);
			}
		}
		
		clearToken();
		return token;
	}

	
	private Token generateTokenBanco(Logger logger, Connection cnLecom, String login, String senha) throws Exception {
		
		try {
			
			// Pega endereço do BPM e do SSO
			Map<String, String> parametrosWF = Funcoes.getParametrosWF(cnLecom);
			String urlBPM = parametrosWF.get("DES_HTTP");
			logger.debug("urlBpm : " + urlBPM);
			//System.out.println("urlBpm" + urlBPM);
			
			int indexHostWF = urlBPM.indexOf(".com.br/bpm");
			logger.debug("indexHostWF : " + indexHostWF);
//			System.out.println("indexHostWF : " + indexHostWF);
			
			String urlSSO = urlBPM.substring(0, indexHostWF) + ".com.br/sso/";
			logger.debug("urlSSO : " + urlSSO);
			//System.out.println("urlSso : " + urlSSO);
			
			//Instancia um usuário e gera um Token
			DadosLogin loginUtil = new DadosLogin(login, senha, false);
			LoginAutenticacao loginAuteAuthentication = new LoginAutenticacao(urlSSO, loginUtil);
			logger.debug("loginAuteAuthentication.getToken() : " + loginAuteAuthentication.getToken());
			
			//access_token
			return new Token(loginAuteAuthentication.getToken(), Instant.now().plus(30, ChronoUnit.MINUTES).toEpochMilli());
		
		} catch (LoginAuthenticationException e) {
			logger.error("LoginAuthenticationException: ", e);
			throw e;
		} catch (Exception e) {
			//logger.error("[TOKEN-MANAGER] ERRO AO GERAR TOKEN: ", e);
			throw new Exception("[TOKEN-MANAGER] ERRO AO GERAR TOKEN: " + Funcoes.exceptionPrinter(e));
		}
	}
	
	
	private Token generateTokenArquivo(Logger logger, Connection cnLecom, String urlSSO, String login, String senha) throws Exception {
		
		try {
			
			logger.debug("urlSSO : " + urlSSO);
			//System.out.println("urlSso : " + urlSSO);
			
			//Instancia um usuário e gera um Token
			DadosLogin loginUtil = new DadosLogin(login, senha, false);
			LoginAutenticacao loginAuteAuthentication = new LoginAutenticacao(urlSSO, loginUtil);
			logger.debug("loginAuteAuthentication.getToken() : " + loginAuteAuthentication.getToken());
			
			//access_token
			return new Token(loginAuteAuthentication.getToken(), Instant.now().plus(30, ChronoUnit.MINUTES).toEpochMilli());
		
		} catch (LoginAuthenticationException e) {
			logger.error("LoginAuthenticationException: ", e);
			throw e;
		} catch (Exception e) {
			//logger.error("[TOKEN-MANAGER] ERRO AO GERAR TOKEN: ", e);
			throw new Exception("[TOKEN-MANAGER] ERRO AO GERAR TOKEN: " + Funcoes.exceptionPrinter(e));
		}
	}
	
	
	/**
	 * Verifica se o token está válido
	 * @param milliseconds
	 * @return true caso válido
	 */
	private boolean isTokenExpired(Long milliseconds) {
		return Instant.now().minusSeconds(5).isAfter(Instant.ofEpochMilli(milliseconds));
	}
	
	
	/**
	 * Limpeza de Tokens expirado após 24 horas
	 */
	private void clearToken() {
		List<String> tokenToRemove = new ArrayList<>();
		
		tokenMap.forEach((login, token) -> {
			if (isTokenExpired(Instant.ofEpochMilli(token.getValidadeToken()).plus(24, ChronoUnit.HOURS).toEpochMilli())) {
				tokenToRemove.add(login);
			}
		});
		tokenToRemove.forEach(login -> tokenMap.remove(login));
	}

}