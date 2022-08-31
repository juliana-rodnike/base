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
var SOLICITAR_CADASTRO = 11;
var COMPLEMENTAR_CADASTRO = 1;

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

	//Valida CNPJ
	Form.fields("CNPJ").subscribe("BLUR", function (itemId, data, response) {
		var retorno = JSPadrao.validaCNPJ({ "campo": "CNPJ" });
		console.log("CNPJ: " + retorno);
	});

	if (codigoEtapa == COMPLEMENTAR_CADASTRO) {


		Form.grids("GRD_SOCIOS").fields("TIPO_PESSOA").subscribe("CHANGE", function (itemId, data, response) {
			console.log("CHANGE: " + response);			

				//defineSelect(response);	
		});	


		Form.grids("GRD_SOCIOS").fields("CPF_TITULAR_CAD_CONJUGE").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			console.log("CPF_TITULAR_CAD_CONJUGE: " + response);
			debugger;			

			var cpfTitular = Form.grids("GRD_SOCIOS").fields("CPF_SOCIOS").value();
			var cpfTitularCadastroConjuge = response;

				if (cpfTitular != cpfTitularCadastroConjuge) {
					Form.grids("GRD_SOCIOS").errors("O CPF do titular está divergente ao que foi cadastrado no processo de cadastro do Cônjuge.");
				}else{
					Form.grids("GRD_SOCIOS").errors("");
				}

		});	


		Form.grids("GRD_SOCIOS").fields("CPF_SOCIOS").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			console.log("CPF_SOCIOS: " + response);
			debugger;			

			var cpfTitular = response;

			if(cpfTitular.length <= 14 ){
				Form.grids("GRD_SOCIOS").fields("TIPO_PESSOA").value("Pessoa Física");
			}else if(cpfTitular.length > 14){
				Form.grids("GRD_SOCIOS").fields("TIPO_PESSOA").value("Pessoa Jurídica");
			}
		});		
		
	}


	//if (codigoEtapa == SOLICITAR_CADASTRO) {

		//Valida CPF PROPONENTE
		// Form.fields("CPF").subscribe("BLUR", function (itemId, data, response) {
		// 	var retorno = JSPadrao.validaCPF({ "campo": "CPF" });
		// 	console.log("CPF: " + retorno);
		// });

		//Valida CPF CONJUGE
		// Form.fields("CPF_CONJUGE").subscribe("BLUR", function (itemId, data, response) {
		// 	var retorno = JSPadrao.validaCPF({ "campo": "CPF_CONJUGE" });
		// 	console.log("CPF_CONJUGE: " + retorno);
		// });

		// //Valida CPF PROCURADOR
		// Form.fields("CPF_PROCURADOR").subscribe("BLUR", function (itemId, data, response) {
		// 	var retorno = JSPadrao.validaCPF({ "campo": "CPF_PROCURADOR" });
		// 	console.log("CPF_PROCURADOR: " + retorno);
		// });

		//VALIDAÇÃO DE E-MAIL
		//Valida EMAIL PROPONENTE
		// Form.fields("EMAIL").subscribe("BLUR", function (itemId, data, response) {
		// 	var retorno = JSPadrao.validaEmail({ "campo": "EMAIL" });
		// 	console.log("EMAIL: " + retorno);
		// });
	//}

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
		debugger;
		
		if (codigoEtapa == SOLICITAR_CADASTRO) {

			// if (!JSPadrao.validaPreenchimentoMinimoItensGRIDSobDemanda({ "grid": "GRD_DOCUMENTOS", "quantidade": "1", "mensagem": "Favor Inserir ao menos um documento de identificação" })) {
			// 	reject();
			// }

			if (!JSPadrao.validaPreenchimentoMinimoItensGRIDSobDemanda({ "grid": "GRD_DOCUMENTOS", "quantidade": "1", "mensagem": "Favor Inserir ao menos um documento de identificação" })) {
				reject();
			}
		}

		if (codigoEtapa == COMPLEMENTAR_CADASTRO) {
			
			if (!JSPadrao.validaPreenchimentoMinimoItensGRIDSobDemanda({ "grid": "GRD_DOC_CNPJ", "quantidade": "1", "mensagem": "Favor Inserir ao menos um documento de identificação" })) {
				reject();
			}

		}
		// if (!JSPadrao.validaPreenchimentoMinimoItensGRIDS({ "grid": "GRD_DOCUMENTOS", "quantidade": "1", "mensagem": "Favor Inserir ao menos um documento de identificação" })) {
		// 	reject();
		// }
		debugger;

		var perfil = Form.fields("AUX_PERFIL").value();

		if (perfil == "Padrão") {
			if (!JSPadrao.validaPreenchimentoMinimoItensGRIDSobDemanda({ "grid": "GRD_COMP_FAT", "quantidade": "1", "mensagem": "Comprovante de Renda Obrigatório para perfil padrão" })) {
				reject();
			}
		}


	});

	Form.apply();
}


