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
var SOLICITAR_CADASTRO      = 11;
var REGULARIZAR_CADASTRO    = 14;
var REALIZAR_CADASTRO_SISBR = 2;

/*
 * Inicializa layout geral
 */
function initLayout() {

}


/*
 * Define Labels com mais de 50 caracteres
 */
function defineLabels() {

}

/*
 * Define ações / listeners
 */
function setEventos() {

	debugger;

	if (codigoEtapa == SOLICITAR_CADASTRO) {

		//Valida CNPJ
		Form.fields("CNPJ").subscribe("BLUR", function (itemId, data, response) {
			var retorno = JSPadrao.validaCNPJ({ "campo": "CNPJ" });
			console.log("CNPJ: " + retorno);
		});		

		Form.grids("GRD_SOCIOS").fields("TIPO_PESSOA").subscribe("CHANGE", function (itemId, data, response) {
			
			console.log("CHANGE: " + response);	

		});	

		Form.grids("GRD_SOCIOS").fields("CPF_SOCIOS").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			console.log("CPF_SOCIOS: " + response);
			var cpfTitular = response;

			if(cpfTitular.length <= 14 ){
				Form.grids("GRD_SOCIOS").fields("TIPO_PESSOA").value("Pessoa Física");
			}else if(cpfTitular.length > 14){
				Form.grids("GRD_SOCIOS").fields("TIPO_PESSOA").value("Pessoa Jurídica");
			}

		});	

		Form.fields("AUX_SQL_CONJUGE").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

			console.log("response: " + response);
			var dadosConjuge = response.split(";");

			dadosConjuge.forEach(function (dados) {

				// Separar resultado do select, uma coluna para cada @
				var cpfAdd        = dados.split("@")[0];
				var nomeAdd       = dados.split("@")[1];
				var restricoesAdd = dados.split("@")[2];

				console.log("cpfAdd: "        + cpfAdd);
				console.log("nomeAdd: "       + nomeAdd);
				console.log("restricoesAdd: " + restricoesAdd);

				Form.grids("GRD_SOCIOS").fields("CPF_CONJUGE_SOCIO").value(cpfAdd).apply();
				Form.grids("GRD_SOCIOS").fields("NOME_CONJUGE_SOCIO").value(nomeAdd).apply();
				Form.grids("GRD_SOCIOS").fields("RESTRICAO_CONJUGE_SOCIO").value(restricoesAdd).apply();

			});			

		});		
		
	}

	Form.apply();
}

/*
 * Formata o formulário
 */
function setForm() {

	if (codigoEtapa == REALIZAR_CADASTRO_SISBR) {

		Form.grids("GRD_SOCIOS").updatePropsRows(null, {visibleRow: true,visibleEdit:true,visibleDelete: false}).apply();

	}

	Form.apply();
}

/*
 * Define novas regras de validação dos campos
 */
function setValidators() {

	Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {
		debugger;

		// Tipos de documentos contábeis
		var faturamento = Form.fields("CHECK_FATUR").value();
		var balanco     = Form.fields("CHECK_BALANC_DRE").value();
		var balancete   = Form.fields("CHECK_BALANCET").value();
		var procurador  = Form.fields("PROCURADOR_REPRE_LEGAL").value();
		
		// Validar anexos obrigatórios solicitar cadastro
		if (codigoEtapa == SOLICITAR_CADASTRO) {

			// Validar anexo documentos contábeis
			if(faturamento == "Sim" || balanco == "Sim" || balancete == "Sim"){
				if(!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "GRD_COMP_FAT", "quantidade": "1" })){
					reject();
					Form.apply();
				}
			}

			// Validar anexo procuradores
			if(procurador == "Sim"){
				if(!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "GRID_PROCURAD", "quantidade": "1" })){
					reject();
					Form.apply();
				}
			}

			// Validar documentos do CNPJ
			if (!JSPadrao.validaPreenchimentoMinimoItensGRIDSobDemanda({ "grid": "GRD_DOCUMENTOS", "quantidade": "1" })) {
				reject();
				Form.apply();
			}

			// Validar grid de sócios
			if (!JSPadrao.validaPreenchimentoMinimoItensGRIDSobDemanda({ "grid": "GRD_SOCIOS", "quantidade": "1" })) {
				reject();
				Form.apply();
			}

		}

		// Validar anexos complementares perfil exceção
		if(codigoEtapa == REGULARIZAR_CADASTRO){

			if (!JSPadrao.validaPreenchimentoMinimoItensGRIDSobDemanda({ "grid": "GRD_ANEXOS_COMP", "quantidade": "1" })) {
				reject();
				Form.apply();
			}

		}

		debugger;

	});

	Form.apply();
}