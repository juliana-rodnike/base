package com.lecom.workflow.cadastros.common.model;

public class Token {
	private int id;
	private String token;
	private Long validadeToken;

	public Token() {
		super();
	}

	public Token(int id, String token) {
		super();
		this.id = id;
		this.token = token;
	}
	
	public Token(String token, Long validadeToken) {
		super();
		this.token = token;
		this.validadeToken = validadeToken;
	}

	public int getId() {
		return id;
	}

	public String getToken() {
		return token;
	}
	
	public Long getValidadeToken() {
		return validadeToken;
	}
}