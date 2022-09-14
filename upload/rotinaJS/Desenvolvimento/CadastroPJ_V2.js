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
var SOLICITAR_CADASTRO          = 11;
var REGULARIZAR_CADASTRO        = 14;
var REALIZAR_CADASTRO_SISBR     = 2;
var ASSUMIR_ATIVIDADE 			= 10;
var CADASTRO_SISBR_OUTRA_COOP   = 17;
var COMPLEMENTAR_CADASTRO_SISBR = 15;
var COMPLEM_SISBR_OUTRA_COOP    = 16;
var FINALIZAR_CADASTRO 			= 6;
var GERAR_CRL 					= 19;
var ATUALIZAR_CRL 				= 18;

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

	if(codigoEtapa == SOLICITAR_CADASTRO) {

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

		Form.fields("DECLARACAO_PA").subscribe("CHANGE", function (itemId, data, response) {
			
			console.log("Check PA: " + response);	

			if(response == "Sim"){

				Form.fields("AUX_USER").value("").apply();

			}
			
		});			

		Form.fields("SQL_CNPJ").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

			console.log("response: " + response);

			var tipo = Form.fields("TIPO_CADASTRO").value();
			var cnpj = Form.fields("CNPJ").value();

			if(tipo == "Novo Cadastro" && cnpj == response){

				console.log("Cadastro já existe");

			}

		});		
		
		Form.grids("GRD_SOCIOS").fields("CPF_CONJUGE_SOCIO").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			Form.grids("GRD_SOCIOS").errors("").apply();

			var socio = Form.grids("GRD_SOCIOS").fields("CPF_SOCIOS").value();
			var conj = Form.grids("GRD_SOCIOS").fields("CPF_CONJUGE_SOCIO").value();

			console.log("socio: " + socio);
			console.log("conjuge: " + conj);

			if((socio && conj != "") && (socio && conj != undefined)){

				if(socio == conj){

					console.log("CPFs iguais");
					Form.grids("GRD_SOCIOS").errors("CPFs iguais.").apply();
									
				}
				else{
	
					Form.grids("GRD_SOCIOS").errors("").apply();
					console.log("validação de cpfs ok");
	
				}

			}

		});			
		
	}

	if(codigoEtapa == REALIZAR_CADASTRO_SISBR || codigoEtapa == CADASTRO_SISBR_OUTRA_COOP || codigoEtapa == COMPLEMENTAR_CADASTRO_SISBR || codigoEtapa == COMPLEM_SISBR_OUTRA_COOP){
 
		 Form.fields("DEFINIR_ROTA").subscribe("CHANGE", function(itemId, data, response) {
 
			 console.log("Rota: " + response);
			 
			 if(response == "Prosseguir"){			
 
				Form.fields('DOC_INVALIDO').visible(false).apply();
				Form.fields('DOC_NAO_ENVIADO').visible(false).apply();
				Form.fields('DOC_INSUFICIENTE').visible(false).apply();
				Form.fields('FALTA_INFORMACOES').visible(false).apply();
				Form.fields('INFO_SISBR').visible(false).apply();
				Form.fields('PEDIDO_PA').visible(false).apply();

				// Não atualizar a variável quando o cadastro for de outra cooperativa para não perder a rota
				if(codigoEtapa == REALIZAR_CADASTRO_SISBR || codigoEtapa == COMPLEMENTAR_CADASTRO_SISBR) Form.fields("AUX_GRUPO_CRL").value("Não").apply();

				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();
 
			 }	
			 
			 if(response == "Gerar CRL"){				
 
				 Form.fields('DOC_INVALIDO').visible(false).apply();
				 Form.fields('DOC_NAO_ENVIADO').visible(false).apply();
				 Form.fields('DOC_INSUFICIENTE').visible(false).apply();
				 Form.fields('FALTA_INFORMACOES').visible(false).apply();
				 Form.fields('INFO_SISBR').visible(false).apply();		
				 Form.fields('PEDIDO_PA').visible(false).apply();	
 
				 Form.fields("AUX_GRUPO_CRL").value("Sim").apply();
 
				 Form.actions('aprovar').disabled(false).apply();
				 Form.actions('rejeitar').disabled(true).apply();
 
			 }
			 
			 if(response == "Devolver"){			
 
				 Form.fields('DOC_INVALIDO').visible(true).apply();
				 Form.fields('DOC_NAO_ENVIADO').visible(true).apply();
				 Form.fields('DOC_INSUFICIENTE').visible(true).apply();
				 Form.fields('FALTA_INFORMACOES').visible(true).apply();
				 Form.fields('INFO_SISBR').visible(true).apply();
				 Form.fields('PEDIDO_PA').visible(true).apply();
 
				 Form.fields("AUX_GRUPO_CRL").value("").apply();
 
				 Form.actions('aprovar').disabled(true).apply();
				 Form.actions('rejeitar').disabled(false).apply();
 
			 }			 
 
		 });				
 
	}	

	Form.apply();
}

/*
 * Formata o formulário
 */
function setForm() {

	if(codigoEtapa == SOLICITAR_CADASTRO){

		//Form.groups("AUX").visible(true);

		var ciclo = Form.fields("CICLO").value();

		if(ciclo == 1){

			Form.groups("ACOES").visible(false);

		}

		if(ciclo > 1){

			// Bloquear campos principais
			Form.fields("TIPO_CADASTRO").disabled(true);
			Form.fields("OBJETIVO").disabled(true);
			Form.fields('DECLARACAO_PA').checked(false);

			// Mostrar checkbox motivo chamado devolvido
			Form.fields('DOC_INVALIDO').visible(true);
			Form.fields('DOC_NAO_ENVIADO').visible(true);
			Form.fields('DOC_INSUFICIENTE').visible(true);
			Form.fields('FALTA_INFORMACOES').visible(true);	
			Form.fields('INFO_SISBR').visible(true);	
			Form.fields('PEDIDO_PA').visible(true);	
			Form.fields('DOC_INVALIDO').readOnly(true);
			Form.fields('DOC_NAO_ENVIADO').readOnly(true);
			Form.fields('DOC_INSUFICIENTE').readOnly(true);
			Form.fields('FALTA_INFORMACOES').readOnly(true);		
			Form.fields('INFO_SISBR').readOnly(true);		
			Form.fields('PEDIDO_PA').readOnly(true);		
			
			// Comentário obrigatório caso o chamado tenha sido devolvido
			Form.fields('OBSERVACOES').setRequired('aprovar', true);				

		}		

	}

	if(codigoEtapa == ASSUMIR_ATIVIDADE){

		Form.groups("IDENTIFICACAO").visible(false);

	}

	if(codigoEtapa == REALIZAR_CADASTRO_SISBR) {

		var rota = Form.fields("DEFINIR_ROTA").value();

		if(rota == "Devolver"){			

			Form.fields('DOC_INVALIDO').visible(true);
			Form.fields('DOC_NAO_ENVIADO').visible(true);
			Form.fields('DOC_INSUFICIENTE').visible(true);
			Form.fields('FALTA_INFORMACOES').visible(true);
			Form.fields('INFO_SISBR').visible(true);
			Form.fields('PEDIDO_PA').visible(true);			
		}			

		Form.grids("GRD_SOCIOS").updatePropsRows(null, {visibleRow: true,visibleEdit:true,visibleDelete: false}).apply();
		Form.actions('aprovar').disabled(true);
		Form.actions('rejeitar').disabled(true);

	}

	if(codigoEtapa == FINALIZAR_CADASTRO || codigoEtapa == REGULARIZAR_CADASTRO){

		Form.groups("ACOES").visible(false);

	}

	if(codigoEtapa == CADASTRO_SISBR_OUTRA_COOP || codigoEtapa == COMPLEMENTAR_CADASTRO_SISBR || codigoEtapa == COMPLEM_SISBR_OUTRA_COOP){

		Form.fields("DEFINIR_ROTA").value("").apply();
		Form.actions('aprovar').disabled(true);
		Form.actions('rejeitar').disabled(true);

	}

	Form.apply();
}

/*
 * Define novas regras de validação dos campos
 */
function setValidators() {

	if(codigoEtapa == SOLICITAR_CADASTRO || codigoEtapa == REGULARIZAR_CADASTRO){

		Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {

			// Variáveis para validação
			var faturamento = Form.fields("CHECK_FATUR").value();
			var balanco     = Form.fields("CHECK_BALANC_DRE").value();
			var balancete   = Form.fields("CHECK_BALANCET").value();
			var procurador  = Form.fields("PROCURADOR_REPRE_LEGAL").value();
			var tipo        = Form.fields("TIPO_CADASTRO").value();
			var cnpj        = Form.fields("CNPJ").value();
			
			// Validar anexos obrigatórios solicitar cadastro
			if(codigoEtapa == SOLICITAR_CADASTRO) {

				var sqlcnpj = Form.fields("SQL_CNPJ").value();

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

				if(tipo == "Novo Cadastro" && cnpj == sqlcnpj){

					console.log("Cadastro já existe");
					Form.fields('CNPJ').errors(['Cadastro já existe.']).apply();
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

	}

	Form.apply();
}