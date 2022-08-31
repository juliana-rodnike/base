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
				motorRegrasPF();
			});
		});

		//Teste Observações
		// Form.fields("OBSERVACOES").subscribe("CHANGE", function (itemId, data, response) {
		// 	motorRegrasPF();
		// 	motorRegrasPJ();
		// });

		//Altera quando valor do campo é atualizado pela api
		Form.fields("AUX_SQL_RETORNO_SOCIOS").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			debugger;

			let dadosGrid = Form.grids('OUTRO_TIT_CNPJ').dataRows();

			if (dadosGrid.length > 0) {

				//limpa informações da GRid
				let grid = Form.grids("OUTRO_TIT_CNPJ");

				grid.dataRows(function (dataRow) {
					grid.removeDataRow(dataRow.id);
				});
			}

			var listaSocios = response.split(";");

			listaSocios.forEach(function (dados) {
				debugger;

				var gridSocio = Form.grids("OUTRO_TIT_CNPJ");

				var tipoPessoa = dados.split("@")[0];
				var nomeSocio = dados.split("@")[1];
				var cpfSpcio = dados.split("@")[2];
				var restricaoSocio = dados.split("@")[3];
				var estadoCivil = dados.split("@")[4];
				var tipoSocio = dados.split("@")[5];
				var nomeConjuge = dados.split("@")[6];
				var cpfConjuge = dados.split("@")[7];
				var restricaoConjuge = dados.split("@")[8];

				//Insere Informações na Grid
				debugger;
				gridSocio.insertDataRow(
					{
						TIPO_PESSOA_SOCIO: tipoPessoa,
						OUTRO_TITU_NOME_CNPJ: nomeSocio,
						OUTRO_TITU_CPF_CNPJ: cpfSpcio,
						OUTRO_TITU_CPF_REST: restricaoSocio,
						OUTRO_TITU_CNPJ_EC: estadoCivil,
						TIPO_SOCIO: tipoSocio,
						NOME_CONJUGE_SOCIO: nomeConjuge,
						CPF_CONJUGE_SOCIO: cpfConjuge,
						OUTRO_CONJ_CNPJ_RESTRI: restricaoConjuge
					}
				);
			});

		});
	}

	Form.apply();
}


/*
 * Formata o formulário
 */
function setForm() {

	// if (codigoEtapa == GERAR_CRL_SISBR_E_COMPLEMENTAR_INFORMACOES) {
	// 	motorRegrasPF();
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

				if (Form.fields("TIPO_PESSOA").value() == "Pessoa Física"){
					retorno = motorRegrasPF();
				}else{
					retorno = motorRegrasPJ();
				}			

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

function motorRegrasPJ(){
	debugger;

	var scoreCNPJ = Form.fields("PONTUACAO_SCORE_CNPJ").value();
	var restricaoCNPJ = Form.fields("RESTRICOES_CNPJ").value();
	var areaAtuacaoCNPJ = Form.fields("AREA_ATUACAO_CNPJ").value();
	var roteamentoPJ = "";

	console.log("####  - Informações Titulares Principal  - #####");
	console.log("Score CNPJ : " + scoreCNPJ);
	console.log("Restricao CNPJ : " + restricaoCNPJ);
	console.log("Area Atuacao PJ: " + areaAtuacaoCNPJ);


	//scoreCNPJ >= 300 (Aprovação Gerente) || restricaoCNPJ != Restrição Impeditiva (Aprovação Gerente)	
	if (scoreCNPJ >= 300 &&
		restricaoCNPJ != "Restrição Impeditiva" &&
		areaAtuacaoCNPJ == "Sim") {
		roteamento = "Aprovar Abertura de Conta - Gerente";
	}

	//ScoreCNPJ < 300 (Parecer + Aprovação Gerente + Aprovação Superintendente)  || //areaAtuacaoCNPJ == Não (Parecer + Aprovação Direx)
	else if ((scoreCNPJ < 300 && (restricaoCNPJ != "Restrição Impeditiva" && restricaoCNPJ != "" && restricaoCNPJ != undefined)) ||
		(restricaoCNPJ != "Restrição Impeditiva" && restricaoCNPJ != "" && restricaoCNPJ != undefined && areaAtuacaoCNPJ == "Não")) {
		roteamento = "Preencher Parecer";
	}

	//RestricaoCNPJ == Restrição Impeditiva (Referências + Parecer + Aprovação Gerente + Aprovação Superintendente)
	else if (restricaoCNPJ == "Restrição Impeditiva") {
		roteamento = "Preencher Parecer e Referências";
	}


	var gridSocios= Form.grids("OUTRO_TIT_CNPJ").dataRows();

	for (var i = 0; i < gridSocios.length; i++) {

		debugger;
		var estadoCivilSocio = gridSocios[i].OUTRO_TITU_CNPJ_EC;
		var restricaoSocio = gridSocios[i].OUTRO_TITU_CPF_REST;
		var restricaoConjugeSocio = gridSocios[i].OUTRO_CONJ_CNPJ_RESTRI;

		console.log("####  - Informações Outros Titulares  - #####");
		console.log("Posição Grid " + i);
		console.log("Estado Civil Socio: " + estadoCivilSocio);
		console.log("Restricao Socio: " + restricaoSocio);
		console.log("Restricao Conjuge Socio: " + restricaoConjugeSocio);


		if (estadoCivilSocio != "Casado" && estadoCivilSocio != "União Estável") {

			//restricaoSocio != Restrição Impeditiva (Aprovação Gerente)
			if (restricaoSocio != "Restrição Impeditiva") {

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

			//restricaoSocio == Restrição Impeditiva (Referências + Parecer + Aprovação Gerente + Aprovação Superintendente)
			else if (restricaoSocio == "Restrição Impeditiva") {
				roteamento = "Preencher Parecer e Referências";
			}

		}

		else if (estadoCivilSocio == "Casado" || estadoCivilSocio == "União Estável") {

			//restricaoConjugeSocio != Restrição Impeditiva (Aprovação Gerente)
			if ((restricaoSocio != "Restrição Impeditiva" && restricaoSocio != "" && restricaoSocio != undefined) &&
				(restricaoConjugeSocio != "Restrição Impeditiva" && restricaoConjugeSocio != "" && restricaoConjugeSocio != undefined)) {

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

			//restricaoConjugeSocio == Restrição Impeditiva (Referências + Parecer + Aprovação Gerente + Aprovação Superintendente)
			else if (restricaoSocio == "Restrição Impeditiva" || restricaoConjugeSocio == "Restrição Impeditiva") {
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

	Form.fields("AUX_ROTEAMENTO_APOS_CRL").value(roteamento);

	Form.apply();

	return roteamento;
}



function motorRegrasPF() {
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