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
var SOLICITAR_CADASTRO = 1;


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

		// //Valida CPF PROCURADOR
		// Form.fields("CPF_PROCURADOR").subscribe("BLUR", function (itemId, data, response) {
		// 	var retorno = JSPadrao.validaCPF({ "campo": "CPF_PROCURADOR" });
		// 	console.log("CPF_PROCURADOR: " + retorno);
		// });

		//VALIDAÇÃO DE E-MAIL
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

	Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {	

		if (!JSPadrao.validaPreenchimentoMinimoItensGRIDSobDemanda({ "grid": "GRD_DOCUMENTOS", "quantidade": "1", "mensagem": "Favor Inserir ao menos um documento de identificação" })){
			reject();
		}

		debugger;
		var perfil = Form.fields("AUX_PERFIL").value();
		if (perfil == "Padrão"){
			if (!JSPadrao.validaPreenchimentoMinimoItensGRIDSobDemanda({ "grid": "GRD_COMP_RENDA", "quantidade": "1", "mensagem": "Comprovante de Renda Obrigatório para perfil padrão" })){
				reject();
			}
		}

	});

	Form.apply();
}