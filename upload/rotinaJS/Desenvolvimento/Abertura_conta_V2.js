$(document).ready(function () {
	setEventos();
	setForm();
	setValidators();

	Form.apply().then(function () {
		defineLabels();
		initLayout();
	});
});


// Dados da atividade
var codigoProcesso = ProcessData.processInstanceId;
var codigoEtapa = ProcessData.activityInstanceId;
var codigoCiclo = ProcessData.cycle;


//Atividades do processo
var SOLICITAR_ABERTURA_DE_CONTA = 1;
var GERAR_CRL_SISBR_E_COMPLEMENTAR_INFORMACOES = 15;


/*
 * Inicializa layout geral
 */
function initLayout() {

	//	if( codigoEtapa == SOLICITAR ){
	//		Form.fields("SOLICITACAO1").className("col m12");
	//	}
	//	
	//	Form.apply();
}


/*
 * Define Labels com mais de 50 caracteres
 */
function defineLabels() {

	//	Form.fields("VEIC_MODELO").label("Label a ser definido");

	//	Form.apply();
}


/*
 * Define ações / listeners
 */
function setEventos() {

	debugger;


	if (codigoEtapa == SOLICITAR_ABERTURA_DE_CONTA) {

		//Valida CPF
		Form.fields("CPF").subscribe("BLUR", function (itemId, data, response) {
			var retorno = JSPadrao.validaCPF({ "campo": "CPF" });
			console.log("CPF: " + retorno);
		});

		//Define roteamento
		Form.fields("ESTADO_CIVIL").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			console.log("ESTADO_CIVIL: " + response);

			Form.apply().then(function () {
				defineRoteamentoGerarCRL();
			});
		});

		//Valida CPF
		Form.fields("OBSERVACOES").subscribe("CHANGE", function (itemId, data, response) {
			defineRoteamentoGerarCRL();
		});
	}

	Form.apply();
}


/*
 * Formata o formulário
 */
function setForm() {

	// if (codigoEtapa == GERAR_CRL_SISBR_E_COMPLEMENTAR_INFORMACOES) {
	// 	defineRoteamentoGerarCRL();
	// }


	Form.apply();
}


/*
 * Define novas regras de validação dos campos
 */
function setValidators() {

	if (codigoEtapa == SOLICITAR_ABERTURA_DE_CONTA) {

		var REJEITAR = true;

		Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {

			if (REJEITAR) {

				retorno = defineRoteamentoGerarCRL();

				if (retorno == "") {
					reject();
				} else {
					REJEITAR = false;
					reject();
					Form.actions("aprovar").execute();
				}
			}
		});
	}
}



function defineRoteamentoGerarCRL() {
	debugger;

	var estadoCivil = Form.fields("ESTADO_CIVIL").value();
	var scoreTitular = Form.fields("PONTUACAO_SCORE_TITULA").value();
	var restricaoTitular = Form.fields("RESTRICOES").value();
	var restricaoConjuge = Form.fields("RESTRICOES_CONJUGE").value();
	var areaAtuacao = Form.fields("AREA_ATUACAO").value();
	var roteamento = "";

	console.log("####  - Informações Titulares Principal  - #####");
	console.log("Estado Civil : " + estadoCivil);
	console.log("Score Titular : " + scoreTitular);
	console.log("Restricao Titular : " + restricaoTitular);
	console.log("Restricao Conjuge : " + restricaoConjuge);
	console.log("Area Atuacao Titular : " + areaAtuacao);

	var composicaoConta = Form.fields("COMPOSICAO_CONTA").value();

	var tipoRota = "";

	if (estadoCivil != "Casado" && estadoCivil != "União Estável") {

		//Scor titual MAIOR ou igual a 600 SEM restrição impeditiva
		if (scoreTitular >= 600 &&
			restricaoTitular != "Restrição Impeditiva" &&
			areaAtuacao == "Sim") {
			roteamento = "Aprovar Abertura de Conta - Gerente";
		}

		//Scor titual MENOR que 600 SEM restrição impeditiva
		else if ((scoreTitular < 600 && (restricaoTitular != "Restrição Impeditiva" && restricaoTitular != "" && restricaoTitular != undefined)) ||
			(restricaoTitular != "Restrição Impeditiva" && restricaoTitular != "" && restricaoTitular != undefined && areaAtuacao == "Não")) {
			roteamento = "Preencher Parecer";
		}

		//titual COM restrição impeditiva
		else if (restricaoTitular == "Restrição Impeditiva") {
			roteamento = "Preencher Parecer e Referências";
		}
	}

	else if (estadoCivil == "Casado" || estadoCivil == "União Estável") {

		//Scor titual MAIOR ou igual a 600, Titular e Cônjuge SEM restrição impeditiva e dentro da Área de Atuação
		if (scoreTitular >= 600 &&
			(restricaoTitular != "Restrição Impeditiva" && restricaoTitular != "" && restricaoTitular != undefined) &&
			(restricaoConjuge != "Restrição Impeditiva" && restricaoConjuge != "" && restricaoConjuge != undefined) &&
			areaAtuacao == "Sim") {

			//Vai para atividade Preencher Parecer
			roteamento = "Aprovar Abertura de Conta - Gerente";
		}

		//Scor titual MENOR que 600, Titular e Cônjuge SEM restrição impeditiva e dentro da Área de Atuação OU 
		else if ((scoreTitular < 600 &&
			(restricaoTitular != "Restrição Impeditiva" && restricaoTitular != "" && restricaoTitular != undefined) &&
			(restricaoConjuge != "Restrição Impeditiva" && restricaoConjuge != "" && restricaoConjuge != undefined))

			||

			((restricaoTitular != "Restrição Impeditiva" && restricaoTitular != "" && restricaoTitular != undefined) &&
				(restricaoConjuge != "Restrição Impeditiva" && restricaoConjuge != "" && restricaoConjuge != undefined) && areaAtuacao == "Não")) {

			//Vai para atividade Preencher Parecer
			roteamento = "Preencher Parecer";
		}

		else if (restricaoTitular == "Restrição Impeditiva" || restricaoConjuge == "Restrição Impeditiva") {
			//Vai para atividade Preencher Parecer e Referências
			roteamento = "Preencher Parecer e Referências";
		}
	}


	console.log("Tipo de Rota - Final da Validação Titular Principal: " + roteamento);
	console.log("");
	console.log("");

	if (roteamento != "Preencher Parecer e Referências") {

		if (composicaoConta == "Conjunta") {

			console.log("Início Validação Outros Titulares");
			console.log("");


			var gridOutrosTitutlares = Form.grids("GRID_OUTROS_T").dataRows();

			for (var i = 0; i < gridOutrosTitutlares.length; i++) {

				var estadoCivilConjunta = gridOutrosTitutlares[i].OUTRO_TITU_ESTADO_CIVIL;
				var scoreTitularConjunta = gridOutrosTitutlares[i].OUTRO_TITU_SCORE;
				var restricaoTitularConjunta = gridOutrosTitutlares[i].OUTRO_TITU_RESTRICOES;
				var restricaoConjugeConjunta = gridOutrosTitutlares[i].OUTRO_CONJ_RESTRICAO;
				var areaAtuacaoConjunta = gridOutrosTitutlares[i].OUTRO_CONJ_AREA_ATUACAO;

				console.log("####  - Informações Outros Titulares  - #####");
				console.log("Posição Grid " + i);
				console.log("Estado Civil Conjunta: " + estadoCivilConjunta);
				console.log("Score Titular Conjunta: " + scoreTitularConjunta);
				console.log("Restricao Titular Conjunta: " + restricaoTitularConjunta);
				console.log("Restricao Conjuge Conjunta: " + restricaoConjugeConjunta);
				console.log("Area Atuacao Conjunta: " + areaAtuacaoConjunta);

				if (estadoCivilConjunta != "Casado" && estadoCivilConjunta != "União Estável") {

					//Scor titual MAIOR ou igual a 600 SEM restrição impeditiva
					if (scoreTitularConjunta >= 600 &&
						restricaoTitularConjunta != "Restrição Impeditiva" &&
						areaAtuacaoConjunta == "Sim") {

						//Valida se a validação anterior é igual a Preencher Parecer e Referências
						if (roteamento == "Preencher Parecer e Referências") {
							roteamento = "Preencher Parecer e Referências";
						}
						//Valida se a validação anterior é igual a Preencher Parecer
						else if (roteamento == "Preencher Parecer") {
							roteamento = "Preencher Parecer";
						}
						//Se não foi enquadrada nos niveis maiores entra na validação real
						else {
							roteamento = "Aprovar Abertura de Conta - Gerente";
						}
					}

					//Scor titual MENOR que 600 SEM restrição impeditiva
					else if ((scoreTitularConjunta < 600 && (restricaoTitularConjunta != "Restrição Impeditiva" && restricaoTitularConjunta != "" && restricaoTitularConjunta != undefined)) ||
						(restricaoTitularConjunta != "Restrição Impeditiva" && restricaoTitularConjunta != "" && restricaoTitularConjunta != undefined && areaAtuacaoConjunta == "Não")) {

						//Valida se a validação anterior é igual a Preencher Parecer e Referências
						if (roteamento == "Preencher Parecer e Referências") {
							roteamento = "Preencher Parecer e Referências";
						}
						//Se não foi enquadrada nos niveis maiores entra na validação real
						else {
							roteamento = "Preencher Parecer";
						}
					}

					//titual COM restrição impeditiva
					else if (restricaoTitularConjunta == "Restrição Impeditiva") {
						roteamento = "Preencher Parecer e Referências";
					}
				}

				else if (estadoCivilConjunta == "Casado" || estadoCivilConjunta == "União Estável") {

					//Scor titual MAIOR ou igual a 600, Titular e Cônjuge SEM restrição impeditiva e dentro da Área de Atuação
					if (scoreTitularConjunta >= 600 &&
						(restricaoTitularConjunta != "Restrição Impeditiva" && restricaoTitularConjunta != "" && restricaoTitularConjunta != undefined) &&
						(restricaoConjugeConjunta != "Restrição Impeditiva" && restricaoConjugeConjunta != "" && restricaoConjugeConjunta != undefined) &&
						areaAtuacao == "Sim") {

						//Valida se a validação anterior é igual a Preencher Parecer e Referências
						if (roteamento == "Preencher Parecer e Referências") {
							roteamento = "Preencher Parecer e Referências";
						}
						//Valida se a validação anterior é igual a Preencher Parecer
						else if (roteamento == "Preencher Parecer") {
							roteamento = "Preencher Parecer";
						}
						//Se não foi enquadrada nos niveis maiores entra na validação real
						else {
							roteamento = "Aprovar Abertura de Conta - Gerente";
						}
					}

					//Scor titual MENOR que 600, Titular e Cônjuge SEM restrição impeditiva e dentro da Área de Atuação OU 
					else if ((scoreTitularConjunta < 600 &&
						(restricaoTitularConjunta != "Restrição Impeditiva" && restricaoTitularConjunta != "" && restricaoTitularConjunta != undefined) &&
						(restricaoConjugeConjunta != "Restrição Impeditiva" && restricaoConjugeConjunta != "" && restricaoConjugeConjunta != undefined))
						||
						((restricaoTitularConjunta != "Restrição Impeditiva" && restricaoTitularConjunta != "" && restricaoTitularConjunta != undefined) &&
							(restricaoConjugeConjunta != "Restrição Impeditiva" && restricaoConjugeConjunta != "" && restricaoConjugeConjunta != undefined) && areaAtuacaoConjunta == "Não")) {


						//Valida se a validação anterior é igual a Preencher Parecer e Referências
						if (roteamento == "Preencher Parecer e Referências") {
							roteamento = "Preencher Parecer e Referências";
						}
						//Se não foi enquadrada nos niveis maiores entra na validação real
						else {
							roteamento = "Preencher Parecer";
						}
					}

					else if (restricaoTitularConjunta == "Restrição Impeditiva" || restricaoConjugeConjunta == "Restrição Impeditiva") {
						//titual ou Conjuge COM restrição impeditiva
						roteamento = "Preencher Parecer e Referências";
					}
				}


				console.log("Tipo de Rota: " + roteamento);
				console.log("");

				if (roteamento == "Preencher Parecer e Referências") {
					break;
				}
			}

			console.log("Fim da Validação Outros Titulares");
			console.log("");
		}
	}

	Form.fields("AUX_ROTEAMENTO_APOS_CRL").value(roteamento);

	Form.apply();

	return roteamento;
}
