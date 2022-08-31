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
var codigoEtapa    = ProcessData.activityInstanceId;
var codigoCiclo    = ProcessData.cycle;


//Atividades do processo
var SOLICITAR_CADASTRO   = 11;
var REGULARIZAR_CADASTRO = 16;


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

	if (codigoEtapa == SOLICITAR_CADASTRO) {

		//Valida CPF PROPONENTE
		Form.fields("CPF").subscribe("BLUR", function (itemId, data, response) {
			var retorno = JSPadrao.validaCPF({ "campo": "CPF" });
			console.log("CPF: " + retorno);
		});

		//Valida CPF CONJUGE
		Form.fields("CPF_CONJUGE").subscribe("BLUR", function (itemId, data, response) {
			var retorno = JSPadrao.validaCPF({ "campo": "CPF_CONJUGE" });
			console.log("CPF_CONJUGE: " + retorno);
		});

		//Valida EMAIL PROPONENTE
		Form.fields("EMAIL").subscribe("BLUR", function (itemId, data, response) {
			var retorno = JSPadrao.validaEmail({ "campo": "EMAIL" });
			console.log("EMAIL: " + retorno);
		});

	}

	Form.apply();
}


/*
 * Formata o formulário
 */
function setForm() {

	if (codigoEtapa == SOLICITAR_CADASTRO) {

		/*
		
		*/
	}

	Form.apply();
}


/*
 * Define novas regras de validação dos campos
 */
function setValidators() {

	// Validar anexos obrigatórios solicitar cadastro
	if(codigoEtapa == SOLICITAR_CADASTRO){

		Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {

			debugger;

			var possuiRenda = Form.fields("RENDA").value();

			// Validar grid comprovante de renda
			if(possuiRenda == "Sim"){
				if(!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "GRD_COMP_RENDA", "quantidade": "1" })){
					reject();
					Form.apply();
				}

			}

			// Validar grid documentos de identificação
			if (!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "GRD_DOCUMENTOS", "quantidade": "1" })) {
				reject();
				Form.apply();
			}	

			debugger;

		});

	}

	// Validar anexos complementares perfil exceção
	if(codigoEtapa == REGULARIZAR_CADASTRO){
		
		Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject){

			debugger;

			// Validar grid anexos complementares
			if (!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "GRD_ANEXOS_COMP", "quantidade": "1" })) {
				reject();
				Form.apply();
			}

		});

	}

	Form.apply();
}