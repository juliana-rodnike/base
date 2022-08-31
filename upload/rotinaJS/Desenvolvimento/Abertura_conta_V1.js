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


	if (codigoEtapa == SOLICITAR_ABERTURA_DE_CONTA){

		//Valida CPF
		Form.fields("CPF").subscribe("BLUR", function (itemId, data, response) {
		var retorno = JSPadrao.validaCPF({ "campo": "CPF" });
		console.log("CPF: " + retorno);
	});

	}

	

	// Etapa Solicitação
	//if (codigoEtapa == SOLICITAR) {

	//		Form.fields("MODALIDADEPJ").subscribe("BLUR", function(itemId, data, response) {
	//			console.log("MODALIDADEPJ : " + Form.fields("MODALIDADEPJ").value());
	//			insertGarantiaVeiculo();
	//		});
	//		
	//		Form.fields("VEIC_MODELO").subscribe("CHANGE", function(itemId, data, response) {
	//			console.log("VEIC_MODELO : " + response);
	//			insertGarantiaVeiculo();
	//		});

	//	}

	Form.apply();
}


/*
 * Formata o formulário
 */
function setForm() {

	if (codigoEtapa == GERAR_CRL_SISBR_E_COMPLEMENTAR_INFORMACOES) {
		defineRoteamentoGerarCRL();
	}


	Form.apply();
}


/*
 * Define novas regras de validação dos campos
 */
function setValidators() {

	/* 	if (codigoEtapa == SOLICITAR) {
		
	
			Form.actions("aprovar").subscribe("SUBMIT",function (itemId, action, reject) {
				var formErrors = Form.errors();
	
				var isGridComprovantesInvalido = validaGridComprovantesCondicionante();
				if(isGridComprovantesInvalido){
					formErrors["COMPROVANTES_CONDICI"] = ['Favor inserir ao menos um comprovante!'];
					Lecom.api.FlashMessageAPI.flash().addMessage({type:"error",message:"Favor inserir ao menos um comprovante!"});
				}
	
				Form.errors(formErrors);
	
				if (Object.keys(formErrors).length) reject();
	
				Form.apply();
			});
		} */
}


function defineRoteamentoGerarCRL() {
	debugger;

	var estadoCivil = Form.fields("ESTADO_CIVIL").value();
	var scoreTitular = Form.fields("PONTUACAO_SCORE_TITULA").value();
	var restricaoTitular = Form.fields("RESTRICOES").value();
	var restricaoConjuge = Form.fields("RESTRICOES_CONJUGE").value();
	var areaAtuacao = Form.fields("AREA_ATUACAO").value();
	var roteamento = Form.fields("AUX_ROTEAMENTO_APOS_CRL")

	if (estadoCivil != "Casado" && estadoCivil != "União Estavel") {

		//Scor titual MAIOR ou igual a 600 SEM restrição impeditiva
		if (scoreTitular >= 600 && 
				restricaoTitular != "Restrição Impeditiva" &&
			 	areaAtuacao == "Sim") {
			roteamento.value("Aprovar Abertura de Conta - Gerente");
		}

		//Scor titual MENOR que 600 SEM restrição impeditiva
		else if ((scoreTitular < 600 && (restricaoTitular != "Restrição Impeditiva" && restricaoTitular != "" && restricaoTitular != undefined)) ||
			(restricaoTitular != "Restrição Impeditiva" && restricaoTitular != "" && restricaoTitular != undefined && areaAtuacao == "Não")) {
			roteamento.value("Preencher Parecer");
		}

		//titual COM restrição impeditiva
		else if (restricaoTitular == "Restrição Impeditiva") {
			roteamento.value("Preencher Parecer e Referências");
		}
	}

	else if (estadoCivil == "Casado"|| estadoCivil == "União Estavel") {

		//Scor titual MAIOR ou igual a 600, Titular e Cônjuge SEM restrição impeditiva e dentro da Área de Atuação
		if (scoreTitular >= 600 &&
			(restricaoTitular != "Restrição Impeditiva" && restricaoTitular != "" && restricaoTitular != undefined) &&
			(restricaoConjuge != "Restrição Impeditiva" && restricaoConjuge != "" && restricaoConjuge != undefined) &&
			areaAtuacao == "Sim") {

			//Vai para atividade Preencher Parecer
			roteamento.value("Aprovar Abertura de Conta - Gerente");
		}

		//Scor titual MENOR que 600, Titular e Cônjuge SEM restrição impeditiva e dentro da Área de Atuação OU 
		else if ((scoreTitular < 600 &&
			(restricaoTitular != "Restrição Impeditiva" && restricaoTitular != "" && restricaoTitular != undefined) &&
			(restricaoConjuge != "Restrição Impeditiva" && restricaoConjuge != "" && restricaoConjuge != undefined)) 
			
			||

			((restricaoTitular != "Restrição Impeditiva" && restricaoTitular != "" && restricaoTitular != undefined) ||
				(restricaoConjuge != "Restrição Impeditiva" && restricaoConjuge != "" && restricaoConjuge != undefined) && areaAtuacao == "Não")) {

			//Vai para atividade Preencher Parecer
			roteamento.value("Preencher Parecer");
		}

		else if (restricaoTitular == "Restrição Impeditiva" || restricaoConjuge == "Restrição Impeditiva") {
			//Vai para atividade Preencher Parecer e Referências
			roteamento.value("Preencher Parecer e Referências");
		}

	}

	Form.apply();
}
