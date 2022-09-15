$(document).ready(function () {
	setForm();
	setEventos();
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
var SOLICITAR_ABERTURA_CONTA = 1;
var JUSTIFICAR_ABERTURA      = 20;
var APROVAR_GERENTE 	     = 16;
var APROVAR_DIREX 			 = 18;
var ABRIR_CONTA_SISBR 		 = 6;
var GERAR_DOSSIE 			 = 5;
var COLETAR_ASSINATURAS 	 = 7;
var ANALISAR_DOSSIE 		 = 12;
var FORMALIZAR_DOSSIE_SISBR  = 11;
var CADASTRAR_CARTEIRA       = 19;
var FINALIZAR_ABERTURA       = 2;

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

	if (codigoEtapa == SOLICITAR_ABERTURA_CONTA) {

		//Valida CPF
		Form.fields("CPF").subscribe("BLUR", function (itemId, data, response) {
			var retorno = JSPadrao.validaCPF({ "campo": "CPF" });
			console.log("CPF: " + retorno);
		});

		// Mostra informações de restrição titular PF
		Form.fields("RESTRICOES").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			if(response == "Restrição Impeditiva" || response == "Restrição Aceitável"){
				Form.fields('JUSTIFICATIVA_RESTRICAO').visible(true).apply();
			}
			else{
				Form.fields('JUSTIFICATIVA_RESTRICAO').visible(false).apply();
			}

		});	
		
		// Mostra informações de restrição titular PJ
		Form.fields("RESTRICOES_CNPJ").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			if(response == "Restrição Impeditiva" || response == "Restrição Aceitável"){
				Form.fields('JUST_RESTRICOES_CNPJ').visible(true).apply();
			}
			else{
				Form.fields('JUST_RESTRICOES_CNPJ').visible(false).apply();
			}

		});			

		// Executa motor de regras PF
		Form.fields("NOME").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

			Form.apply().then(function () {
				motorRegrasPF();
			});

		});		

		// Executa motor de regras PJ
		Form.fields("RAZAO_SOCIAL").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

			Form.apply().then(function () {
				motorRegrasPJ();
			});

		});			
		
		// Mostra informações do procurador / rep. legal
		Form.fields("PROCURADOR_REP").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			if(response == "Sim"){
				Form.fields('CPF_PROC_REP').visible(true);
				Form.fields('NOME_PROC_REP').visible(true);
				Form.fields('SCORE_PROCURADOR').visible(true);
				Form.fields('RESTRICOES_PROC_REP').visible(true);
				Form.fields('CAPITAL_PROC').visible(true);
			}
			else{
				Form.fields('CPF_PROC_REP').visible(false);
				Form.fields('NOME_PROC_REP').visible(false);
				Form.fields('SCORE_PROCURADOR').visible(false);
				Form.fields('RESTRICOES_PROC_REP').visible(false);
				Form.fields('CAPITAL_PROC').visible(false);
			}

			Form.apply();

		});	

		// Mostra informações do cônjuge
		Form.fields("ESTADO_CIVIL").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			if(response == "Casado" || response == "União Estável"){
				Form.fields('CPF_CONJUGE').visible(true);
				Form.fields('NOME_CONJUGE').visible(true);
			}
			else{
				Form.fields('CPF_CONJUGE').visible(false);
				Form.fields('NOME_CONJUGE').visible(false);
			}

			Form.apply();

		});			

		// Mostra informações de restrição do procurador/rep. legal
		Form.fields("RESTRICOES_PROC_REP").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			if(response == "Restrição Impeditiva" || response == "Restrição Aceitável"){
				Form.fields('JUST_REST_PROC_REP').visible(true).apply();
			}
			else{
				Form.fields('JUST_REST_PROC_REP').visible(false).apply();
			}

		});			
		
		// Mostra cidade quando for fora da área PF
		Form.fields("AREA_ATUACAO").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			if(response == "Não"){
				Form.fields('CIDADE').visible(true).apply();
			}
			else{
				Form.fields('CIDADE').visible(false).apply();
			}

		});	
		
		// Mostra cidade quando for fora da área PJ
		Form.fields("AREA_ATUACAO_CNPJ").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			if(response == "Não"){
				Form.fields('CIDADE_CNOJ').visible(true).apply();
			}
			else{
				Form.fields('CIDADE_CNOJ').visible(false).apply();
			}

		});		

		// Mostrar campos titular PF ou PJ
		Form.fields("TIPO_PESSOA").subscribe("CHANGE", function(itemId, data, response) {

			if(response == "Pessoa Física"){

				// Objetivo da conta
				Form.fields('OBJETIVO').visible(true);
				Form.fields("OBJETIVO").setRequired('aprovar', true);

				// Mostrar campos PJ
				Form.groups('GR_CNPJ').visible(false);
				Form.groups('GR_OUTROS_TITU_CNPJ').visible(false);

				// Razão social e CNPJ bloqueado e obrigatório
				Form.fields("RAZAO_SOCIAL").disabled(false);
				Form.fields("CNPJ").disabled(false);
				Form.fields("RAZAO_SOCIAL").setRequired('aprovar', false);
				Form.fields("CNPJ").setRequired('aprovar', false);

				// Ocultar campos PJ
				Form.fields('JUST_RESTRICOES_CNPJ').visible(false);
				Form.fields('CIDADE_CNOJ').visible(false);				

			}
			else{

				// Ocultar campos PF
				Form.fields('OBJETIVO').visible(false);
				Form.fields("OBJETIVO").setRequired('aprovar', false);
				Form.fields("CPF").setRequired('aprovar', false);
				Form.fields("NOME").setRequired('aprovar', false);
				Form.groups('DADOS_PROPNETE_TITULAR').visible(false);
				Form.groups("CONTA").visible(false);
				Form.fields("CONTA").setRequired('aprovar', false);
				Form.fields("ABERTURA").setRequired('aprovar', false);
				Form.fields("CATEGORIA").setRequired('aprovar', false);

				// Mostrar campos PJ
				Form.groups('GR_CNPJ').visible(true);
				Form.groups('GR_OUTROS_TITU_CNPJ').visible(true);

				// Razão social e CNPJ bloqueado e obrigatório
				Form.fields("RAZAO_SOCIAL").disabled(true);
				Form.fields("CNPJ").disabled(true);
				Form.fields("RAZAO_SOCIAL").setRequired('aprovar', true);
				Form.fields("CNPJ").setRequired('aprovar', true);

				// Ocultar campos PJ
				Form.fields('JUST_RESTRICOES_CNPJ').visible(false);
				Form.fields('CIDADE_CNOJ').visible(false);

			}

			Form.apply();
		
		});		
		
		// Mostrar grid conta conjunta
		Form.fields("COMPOSICAO_CONTA").subscribe("CHANGE", function(itemId, data, response) {

			if(response == "Conjunta"){

				// Mostrar grupo
				Form.groups('GR_OUTROS_TITULARES').visible(true);

				// Nome e CPF bloqueado e  obrigatório
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_NOME").disabled(true);
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_CPF").disabled(true);
				Form.grids("GRID_OUTROS_T").fields("CAPITAL").disabled(true);
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_NOME").setRequired('aprovar', true);
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_CPF").setRequired('aprovar', true);				

				// Ocultar campos
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_SCORE").visible(false);
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_RESTRICOES").visible(false);
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_JUST_REST").visible(false);

			}
			else{

				Form.groups('GR_OUTROS_TITULARES').visible(false);
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_NOME").setRequired('aprovar', false);
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_CPF").setRequired('aprovar', false);					

			}

			Form.apply();
		
		});			

		// Conta nova e inclusão de titular
		Form.fields("OBJETIVO").subscribe("CHANGE", function(itemId, data, response) {

			if(response == "Conta Nova"){

				// Ocultar campos da conta
				Form.groups("CONTA").visible(false);
				Form.fields("CONTA").setRequired('aprovar', false);
				Form.fields("ABERTURA").setRequired('aprovar', false);
				Form.fields("CATEGORIA").setRequired('aprovar', false);

				//Exibir campos do titular
				Form.groups('DADOS_PROPNETE_TITULAR').visible(true);
				Form.fields("CPF").disabled(true);
				Form.fields("NOME").disabled(true);
				Form.fields("CPF").setRequired('aprovar', true);
				Form.fields("NOME").setRequired('aprovar', true);

				// Ocultar campos rep. legal e jsutificativas de restrição
				Form.fields('JUSTIFICATIVA_RESTRICAO').visible(false);
				Form.fields('CIDADE').visible(false);
				Form.fields('CPF_CONJUGE').visible(false);
				Form.fields('NOME_CONJUGE').visible(false);
				Form.fields('JUST_REST_PROC_REP').visible(false);
				Form.fields('RESTRICOES_PROC_REP').visible(false);
				Form.fields('SCORE_PROCURADOR').visible(false);
				Form.fields('CPF_PROC_REP').visible(false);
				Form.fields('NOME_PROC_REP').visible(false);
				Form.fields('CAPITAL_TIT').visible(false);

				// Exibir composição da conta
				Form.fields('COMPOSICAO_CONTA').visible(true);
				Form.fields("COMPOSICAO_CONTA").setRequired('aprovar', true);

			}
			else{
				
				// Exibir campos da conta
				Form.groups("CONTA").visible(true);
				Form.grids("G_CONTA").readOnly(true);
				Form.fields("CPF_CONTA").visible(false);
				Form.fields("NOME_CONTA").visible(false);	
				Form.fields("CONTA").setRequired('aprovar', true);
				Form.fields("ABERTURA").setRequired('aprovar', true);
				Form.fields("CATEGORIA").setRequired('aprovar', true);
				
				//Exibir campos do titular
				Form.groups('DADOS_PROPNETE_TITULAR').visible(true);
				Form.fields("CPF").disabled(true);
				Form.fields("NOME").disabled(true);
				Form.fields("CPF").setRequired('aprovar', true);
				Form.fields("NOME").setRequired('aprovar', true);
				Form.fields('CAPITAL_TIT').visible(true);

				// Ocultar campos rep. legal e jsutificativas de restrição
				Form.fields('JUSTIFICATIVA_RESTRICAO').visible(false);
				Form.fields('CIDADE').visible(false);
				Form.fields('CPF_CONJUGE').visible(false);
				Form.fields('NOME_CONJUGE').visible(false);
				Form.fields('JUST_REST_PROC_REP').visible(false);
				Form.fields('RESTRICOES_PROC_REP').visible(false);
				Form.fields('SCORE_PROCURADOR').visible(false);
				Form.fields('CPF_PROC_REP').visible(false);
				Form.fields('NOME_PROC_REP').visible(false);
				
				// Ocultar composição da conta
				Form.fields('COMPOSICAO_CONTA').visible(false);
				Form.fields("COMPOSICAO_CONTA").setRequired('aprovar', false);	
				
				// Mostrar grupo de titulares adicionais
				Form.groups('GR_OUTROS_TITULARES').visible(true);

				// Nome e CPF bloqueado e  obrigatório
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_NOME").disabled(true);
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_CPF").disabled(true);	
				Form.grids("GRID_OUTROS_T").fields("CAPITAL").disabled(true);		

				// Ocultar campos
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_SCORE").visible(false);
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_RESTRICOES").visible(false);
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_JUST_REST").visible(false);		

			}

			Form.apply();
		
		});			

		// Altera quando valor do campo é atualizado pela api
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
		
		// Resultado select cadastros adicionais
		Form.fields("AUX_SQL_ADICIONAIS").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

			console.log("Adicionais: " + response);

			let dadosGrid = Form.grids('GRID_OUTROS_T').dataRows();

			// Limpar grid cadastros adicionais
			if (dadosGrid.length > 0) {

				let grid = Form.grids("GRID_OUTROS_T");

				grid.dataRows(function (dataRow) {
					grid.removeDataRow(dataRow.id);
				});

			}

			var listaCadAdd = response.split(";");

			console.log("listaCadAdd: " + listaCadAdd);

			listaCadAdd.forEach(function (dados) {

				debugger;

				// Separar resultado do select, uma coluna para cada @
				var gridCadAdd = Form.grids("GRID_OUTROS_T");

				var cpfAdd        = dados.split("@")[0];
				var nomeAdd       = dados.split("@")[1];
				var scoreAdd      = dados.split("@")[2];
				var restricoesAdd = dados.split("@")[3];
				var justRestAdd   = dados.split("@")[4];
				var capital       = dados.split("@")[5];


				console.log("cpfAdd: "        + cpfAdd);
				console.log("nomeAdd: "       + nomeAdd);
				console.log("scoreAdd: "      + scoreAdd);
				console.log("restricoesAdd: " + restricoesAdd);
				console.log("justRestAdd: "   + justRestAdd);
				console.log("capital: "       + capital);

				// Inserir cadastro adicionais na grid
				debugger;
				gridCadAdd.insertDataRow(
					{
						OUTRO_TITU_CPF:        cpfAdd,
						OUTRO_TITU_NOME:       nomeAdd,
						OUTRO_TITU_SCORE:      scoreAdd,
						OUTRO_TITU_RESTRICOES: restricoesAdd,
						OUTRO_TITU_JUST_REST:  justRestAdd,
						CAPITAL:               capital
					}
				);

			});

		});	

		// Rota definida
		Form.fields("AUX_ROTEAMENTO_APOS_CRL").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			console.log("Rota definida: " + response);

		});	
		
		// Inclusão de titular
		Form.fields("SQL_TITULARES").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

			console.log("response: " + response);

			let dadosGrid = Form.grids('G_CONTA').dataRows();

			if (dadosGrid.length > 0) {

				//limpa informações da GRid
				let grid = Form.grids("G_CONTA");

				grid.dataRows(function (dataRow) {
					grid.removeDataRow(dataRow.id);
				});
			}

			var listaTitulares = response.split(";");

			listaTitulares.forEach(function (dados) {

				var titualares = Form.grids("G_CONTA");

				var cpf  = dados.split("@")[0];
				var nome = dados.split("@")[1];

				titualares.insertDataRow(
					{
						CPF_TITULAR: cpf,
						NOME_TITULAR: nome
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

	if(codigoEtapa == SOLICITAR_ABERTURA_CONTA){

		//Form.groups('AUX').visible(true).apply();
		
		Form.groups('CONTA').visible(false);
		Form.groups('GR_OUTROS_TITULARES').visible(false);
		Form.groups('DADOS_PROPNETE_TITULAR').visible(false);
		Form.groups('JUSTIFICATIVAS').visible(false);
		Form.groups('GR_CNPJ').visible(false);
		Form.groups('GR_OUTROS_TITU_CNPJ').visible(false);
		Form.groups('GROUP6').visible(false);

		// Informações da conta
		var auxTipoPessoa  = Form.fields("TIPO_PESSOA").value();
		var auxComposicao  = Form.fields("COMPOSICAO_CONTA").value();
		var auxTalao       = Form.fields("SOLICITAR_TALAO").value();
		var auxRoteamento  = Form.fields("AUX_ROTEAMENTO_APOS_CRL").value();
		var auxObjetivo    = Form.fields("OBJETIVO").value();

		// Informações conta PF
		var auxEstadoCivil = Form.fields("ESTADO_CIVIL").value();		
		var auxAreaAtuacao = Form.fields("AREA_ATUACAO").value();
		var auxRestricaoT  = Form.fields("RESTRICOES").value();	
		var auxProcurador  = Form.fields("PROCURADOR_REP").value();	
		var auxRestricaoP  = Form.fields("RESTRICOES_PROC_REP").value();
		
		// Informações conta PJ
		var auxRestricaoPJ   = Form.fields("RESTRICOES_CNPJ").value();		
		var auxAreaAtuacaoPJ = Form.fields("AREA_ATUACAO_CNPJ").value();	

		console.log("Tipo pessoa: " + auxTipoPessoa);
		console.log("Composicao: " + auxComposicao);

		// Formulário conta corrente
		if(auxTipoPessoa == "Pessoa Física"){

			Form.groups('DADOS_PROPNETE_TITULAR').visible(true);
			Form.groups('GR_CNPJ').visible(false);
			Form.groups('GR_OUTROS_TITU_CNPJ').visible(false);
			Form.fields('OBJETIVO').visible(true);

			if(auxObjetivo == "Conta Nova"){
				Form.fields('COMPOSICAO_CONTA').visible(true);
				Form.groups("CONTA").visible(false);
			}
			else{
				Form.fields('COMPOSICAO_CONTA').visible(false);
				Form.groups("CONTA").visible(true);
				Form.grids("G_CONTA").readOnly(true);
				Form.fields("CPF_CONTA").visible(false);
				Form.fields("NOME_CONTA").visible(false);				
			}

			if(auxComposicao == "Individual"){ 
				Form.groups('GR_OUTROS_TITULARES').visible(false); 
			}
			else{ 
				Form.groups('GR_OUTROS_TITULARES').visible(true); 
			}

			if(auxEstadoCivil == "Casado" || auxEstadoCivil == "União Estável"){
				Form.fields('CPF_CONJUGE').visible(true);
				Form.fields('NOME_CONJUGE').visible(true);
			}
			else{
				Form.fields('CPF_CONJUGE').visible(false);
				Form.fields('NOME_CONJUGE').visible(false);
			}

			if(auxProcurador == "Sim"){
				Form.fields('CPF_PROC_REP').visible(true);
				Form.fields('NOME_PROC_REP').visible(true);
				Form.fields('SCORE_PROCURADOR').visible(true);
				Form.fields('RESTRICOES_PROC_REP').visible(true);
				Form.fields('CAPITAL_PROC').visible(true);
			}
			else{
				Form.fields('CPF_PROC_REP').visible(false);
				Form.fields('NOME_PROC_REP').visible(false);
				Form.fields('SCORE_PROCURADOR').visible(false);
				Form.fields('RESTRICOES_PROC_REP').visible(false);
				Form.fields('CAPITAL_PROC').visible(false);
			}	
			
			if(auxAreaAtuacao == "Não"){
				Form.fields('CIDADE').visible(true);
			}
			else{
				Form.fields('CIDADE').visible(false);
			}	
			
			if(auxRestricaoT == "Restrição Impeditiva" || auxRestricaoT == "Restrição Aceitável"){
				Form.fields('JUSTIFICATIVA_RESTRICAO').visible(true);
			}
			else{
				Form.fields('JUSTIFICATIVA_RESTRICAO').visible(false);
			}	
			
			if(auxRestricaoP == "Restrição Impeditiva" || auxRestricaoP == "Restrição Aceitável"){
				Form.fields('JUST_REST_PROC_REP').visible(true);
			}
			else{
				Form.fields('JUST_REST_PROC_REP').visible(false);
			}		

		}
		else if(auxTipoPessoa == "Pessoa Jurídica"){

			Form.groups('GR_CNPJ').visible(true);
			Form.groups('GR_OUTROS_TITU_CNPJ').visible(true);	
			Form.groups('DADOS_PROPNETE_TITULAR').visible(false);	
			Form.groups('GR_OUTROS_TITULARES').visible(false);	
			Form.fields('COMPOSICAO_CONTA').visible(false);

			if(auxAreaAtuacaoPJ == "Não"){
				Form.fields('CIDADE_CNOJ').visible(true);
			}
			else{
				Form.fields('CIDADE_CNOJ').visible(false);
			}	
			
			if(auxRestricaoPJ == "Restrição Impeditiva" || auxRestricaoPJ == "Restrição Aceitável"){
				Form.fields('JUST_RESTRICOES_CNPJ').visible(true);
			}
			else{
				Form.fields('JUST_RESTRICOES_CNPJ').visible(false);
			}			

		}		

	}

	if(codigoEtapa == APROVAR_GERENTE || codigoEtapa == APROVAR_DIREX || codigoEtapa == ABRIR_CONTA_SISBR || codigoEtapa == GERAR_DOSSIE || codigoEtapa == COLETAR_ASSINATURAS || 
	   codigoEtapa == ANALISAR_DOSSIE || codigoEtapa == FORMALIZAR_DOSSIE_SISBR || codigoEtapa == CADASTRAR_CARTEIRA || codigoEtapa == FINALIZAR_ABERTURA || codigoEtapa == JUSTIFICAR_ABERTURA){

		// Informações da conta
		var auxTipoPessoa  = Form.fields("TIPO_PESSOA").value();
		var auxComposicao  = Form.fields("COMPOSICAO_CONTA").value();
		var auxTalao       = Form.fields("SOLICITAR_TALAO").value();
		var auxRoteamento  = Form.fields("AUX_ROTEAMENTO_APOS_CRL").value();
		var auxObjetivo    = Form.fields("OBJETIVO").value();

		// Informações conta PF
		var auxEstadoCivil = Form.fields("ESTADO_CIVIL").value();		
		var auxAreaAtuacao = Form.fields("AREA_ATUACAO").value();
		var auxRestricaoT  = Form.fields("RESTRICOES").value();	
		var auxProcurador  = Form.fields("PROCURADOR_REP").value();	
		var auxRestricaoP  = Form.fields("RESTRICOES_PROC_REP").value();
		
		// Informações conta PJ
		var auxRestricaoPJ   = Form.fields("RESTRICOES_CNPJ").value();		
		var auxAreaAtuacaoPJ = Form.fields("AREA_ATUACAO_CNPJ").value();	

		// Formulário conta corrente
		if(auxTipoPessoa == "Pessoa Física"){

			Form.groups('GR_CNPJ').visible(false);
			Form.groups('GR_OUTROS_TITU_CNPJ').visible(false);
			Form.fields('OBJETIVO').visible(true);
			Form.fields('OBJETIVO').readOnly(true);

			if(auxObjetivo == "Conta Nova"){
				Form.fields('COMPOSICAO_CONTA').visible(true);
				Form.groups("CONTA").visible(false);
			}
			else{
				Form.fields('COMPOSICAO_CONTA').visible(false);
				Form.fields('COMPOSICAO_CONTA').readOnly(false);
				Form.groups("CONTA").visible(true);
				Form.grids("G_CONTA").readOnly(true);
				Form.fields("CPF_CONTA").visible(false);
				Form.fields("NOME_CONTA").visible(false);				
			}			

			if(auxComposicao == "Individual"){ 
				Form.groups('GR_OUTROS_TITULARES').visible(false); 
			}
			else{ 
				Form.groups('GR_OUTROS_TITULARES').visible(true); 
			}

			if(auxEstadoCivil == "Casado" || auxEstadoCivil == "União Estável"){
				Form.fields('CPF_CONJUGE').visible(true);
				Form.fields('NOME_CONJUGE').visible(true);
			}
			else{
				Form.fields('CPF_CONJUGE').visible(false);
				Form.fields('NOME_CONJUGE').visible(false);
			}

			if(auxProcurador == "Sim"){
				Form.fields('CPF_PROC_REP').visible(true);
				Form.fields('NOME_PROC_REP').visible(true);
				Form.fields('SCORE_PROCURADOR').visible(true);
				Form.fields('RESTRICOES_PROC_REP').visible(true);
				Form.fields('CAPITAL_PROC').visible(true);
			}
			else{
				Form.fields('CPF_PROC_REP').visible(false);
				Form.fields('NOME_PROC_REP').visible(false);
				Form.fields('SCORE_PROCURADOR').visible(false);
				Form.fields('RESTRICOES_PROC_REP').visible(false);
				Form.fields('CAPITAL_PROC').visible(false);
			}	
			
			if(auxAreaAtuacao == "Não"){
				Form.fields('CIDADE').visible(true);
			}
			else{
				Form.fields('CIDADE').visible(false);
			}	
			
			if(auxRestricaoT == "Restrição Impeditiva" || auxRestricaoT == "Restrição Aceitável"){
				Form.fields('JUSTIFICATIVA_RESTRICAO').visible(true);
			}
			else{
				Form.fields('JUSTIFICATIVA_RESTRICAO').visible(false);
			}	
			
			if(auxRestricaoP == "Restrição Impeditiva" || auxRestricaoP == "Restrição Aceitável"){
				Form.fields('JUST_REST_PROC_REP').visible(true);
			}
			else{
				Form.fields('JUST_REST_PROC_REP').visible(false);
			}		

		}
		else{

			Form.groups('GR_CNPJ').visible(true);
			Form.groups('GR_OUTROS_TITU_CNPJ').visible(true);	
			Form.groups('DADOS_PROPNETE_TITULAR').visible(false);	
			Form.groups('GR_OUTROS_TITULARES').visible(false);	
			Form.fields('COMPOSICAO_CONTA').visible(false);

			if(auxAreaAtuacaoPJ == "Não"){
				Form.fields('CIDADE_CNOJ').visible(true);
			}
			else{
				Form.fields('CIDADE_CNOJ').visible(false);
			}	
			
			if(auxRestricaoPJ == "Restrição Impeditiva" || auxRestricaoPJ == "Restrição Aceitável"){
				Form.fields('JUST_RESTRICOES_CNPJ').visible(true);
			}
			else{
				Form.fields('JUST_RESTRICOES_CNPJ').visible(false);
			}			

		}

		if(codigoEtapa == JUSTIFICAR_ABERTURA){

			// Justificativas abertura de conta
			if(auxRoteamento == "Preencher Parecer"){
				Form.groups('JUSTIFICATIVAS').visible(true);
				Form.fields("PARECER").setRequired('aprovar', true);
				Form.fields('OBS_REFERENCIAS').visible(false);
			}
			else if(auxRoteamento == "Preencher Parecer e Referências"){
				Form.groups('JUSTIFICATIVAS').visible(true);
				Form.fields("OBS_REFERENCIAS").setRequired('aprovar', true);				
				Form.fields("PARECER").setRequired('aprovar', true);
			}
			else if(auxRoteamento == "Aprovar Abertura de Conta - Gerente"){
				Form.groups('JUSTIFICATIVAS').visible(false);
				Form.fields("PARECER").setRequired('aprovar', false);
				Form.fields("OBS_REFERENCIAS").setRequired('aprovar', false);				
			}		
		
		}

		else if(codigoEtapa != JUSTIFICAR_ABERTURA){

			// Justificativas abertura de conta
			if(auxRoteamento == "Preencher Parecer"){
				Form.fields('OBS_REFERENCIAS').visible(false);
				Form.fields('PARECER').visible(true);
			}
			else if(auxRoteamento == "Preencher Parecer e Referências"){
				Form.fields('OBS_REFERENCIAS').visible(true);
				Form.fields('PARECER').visible(true);
			}
			else if(auxRoteamento == "Aprovar Abertura de Conta - Gerente" || auxRoteamento == "Abrir conta"){
				Form.groups('JUSTIFICATIVAS').visible(false);				
			}		

		}

		// Informações talão
		if(auxTalao == "Sim" && codigoEtapa != APROVAR_GERENTE){

			Form.fields('QTD_FOLHAS').visible(true);
			Form.fields('TALAO_APROVADO').visible(true);

		}
		else if(auxTalao == "Não" && codigoEtapa != APROVAR_GERENTE){

			Form.fields('QTD_FOLHAS').visible(false);
			Form.fields('TALAO_APROVADO').visible(false);

		}		

	}

	Form.apply();

}

/*
 * Define novas regras de validação dos campos
 */
function setValidators() {

	// Executar motor de regras na aprovação da etapa
	if(codigoEtapa == SOLICITAR_ABERTURA_CONTA) {
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

	var restricaoTitular = Form.fields("RESTRICOES").value();
	var possuiProcRep    = Form.fields("PROCURADOR_REP").value();
	var restricaoProcRep = Form.fields("RESTRICOES_PROC_REP").value();
	var areaAtuacao      = Form.fields("AREA_ATUACAO").value();
	var composicaoConta  = Form.fields("COMPOSICAO_CONTA").value();
	var objetivoAbertura = Form.fields("OBJETIVO").value();
	var capitalTitular   = Form.fields("CAPITAL_TIT").value();
	var roteamento       = "";

	console.log ("### INICIO MOTOR REGRAS PF ###");

	console.log("Composição da conta: "        + composicaoConta);
	console.log("Restricoes titular: "         + restricaoTitular);
	console.log("Possui proc/rep. legal?: "    + possuiProcRep);
	console.log("Restricoes proc/rep. legal: " + restricaoProcRep);
	console.log("Area de atuação: "            + areaAtuacao);
	console.log("Objetivo da abertura: "       + objetivoAbertura);
	console.log("Titular tem capital?: "       + capitalTitular);

	// Regras para conta nova
	if(objetivoAbertura == "Conta Nova"){

		debugger;

		console.log ("### INICIO VALIDAÇÃO DE REGRAS CONTA NOVA ###");

		// Titular sem procurador/rep. legal
		if (possuiProcRep == "Não") {

			console.log("Não possui procurador");

			// Titular sem restrição dentro da área - não exige parecer e referência
			if (restricaoTitular != "Restrição Impeditiva" && areaAtuacao == "Sim") { 
				
				console.log("Titular sem restrição dentro da área");
				roteamento = "Aprovar Abertura de Conta - Gerente"; 
			
			}

			// Titular sem restrição fora da área - exige parecer
			else if (restricaoTitular != "Restrição Impeditiva" && areaAtuacao == "Não") { 
				
				console.log("Titular sem restrição fora da área");
				roteamento = "Preencher Parecer"; 
			
			}

			// Titular com restrição - exige parecer e referências
			else if (restricaoTitular == "Restrição Impeditiva") { 
				
				console.log("Titular com restrição");
				roteamento = "Preencher Parecer e Referências"; 
			
			}

		}

		// Titular com procurador/rep. legal
		else if (possuiProcRep == "Sim") {

			console.log("Possui procurador");

			// Titular e procurador sem restrição dentro da área - não exige parecer e referência
			if ((restricaoTitular != "Restrição Impeditiva" && restricaoProcRep != "Restrição Impeditiva") && areaAtuacao == "Sim") {

				console.log("Procurador e titular sem restrição dentro da área");
				roteamento = "Aprovar Abertura de Conta - Gerente";
			}

			// Titular e procurador sem restrição fora da área - exige parecer
			else if ((restricaoTitular != "Restrição Impeditiva" && restricaoProcRep != "Restrição Impeditiva") && areaAtuacao == "Não") {

				console.log("Procurador e titular sem restrição fora da área");
				roteamento = "Preencher Parecer";
			}

			// Titular ou procurador com restrição - exige parecer e referências
			else if (restricaoTitular == "Restrição Impeditiva" || restricaoProcRep == "Restrição Impeditiva") {
				
				console.log("Procurador ou titular com restrição");
				roteamento = "Preencher Parecer e Referências";
			}

		}

		console.log("Tipo de Rota - Final da Validação Titular Principal: " + roteamento);

		if (roteamento != "Preencher Parecer e Referências") {

			if (composicaoConta == "Conjunta") {

				console.log("Início Validação Titulares Adicionais");

				var gridOutrosTitutlares = Form.grids("GRID_OUTROS_T").dataRows();

				for (var i = 0; i < gridOutrosTitutlares.length; i++) {

					var restricaoTitularAdd = gridOutrosTitutlares[i].OUTRO_TITU_RESTRICOES;

					console.log("Linha: " + i);
					console.log("Restricao Titular Adicional: " + restricaoTitularAdd);

					// Titular adicional sem restrição
					if (restricaoTitularAdd != "Restrição Impeditiva") {

						// Valida se a rota anterior é igual a Preencher Parecer e Referências
						if (roteamento == "Preencher Parecer e Referências") {
							roteamento = "Preencher Parecer e Referências";
						}
						// Valida se a rota anterior é igual a Preencher Parecer
						else if (roteamento == "Preencher Parecer") {
							roteamento = "Preencher Parecer";
						}
						// Se não foi enquadrada nos niveis maiores entra na validação real
						else {
							roteamento = "Aprovar Abertura de Conta - Gerente";
						}
					}

					// Titular adicional com restrição
					else if (restricaoTitularAdd == "Restrição Impeditiva") {
						roteamento = "Preencher Parecer e Referências";
					}

					console.log("Tipo de Rota - Final da Validação Titulares Adicionais: " + roteamento);

					// Interromper validação caso seja identificado algum titular com restrição
					if (roteamento == "Preencher Parecer e Referências") { break; }

				}

				console.log("Fim da Validação Titulares Adicionais");
				
			}

		}

		debugger;

	}

	// Regras para inclusão de titular
	else{

		debugger;

		console.log ("### INICIO VALIDAÇÃO DE REGRAS INCLUSÃO DE TITULAR ###");

		// Titular sem procurador/rep. legal
		if (possuiProcRep == "Não") {

			console.log("Não possui procurador");

			// Titular sem restrição com capital - abrir conta direto
			if (restricaoTitular != "Restrição Impeditiva" && capitalTitular == "Sim") { 
				
				console.log("Titular sem restrição com capital");
				roteamento = "Abrir conta"; 
			
			}

			// Titular sem restrição sem capital - aprovação gerente
			else if (restricaoTitular != "Restrição Impeditiva" && capitalTitular != "Sim") { 
				
				console.log("Titular sem restrição sem capital");
				roteamento = "Aprovar Abertura de Conta - Gerente"; 
			
			}		

			// Titular com restrição - exige parecer e referências e aprovação do gerente
			else if (restricaoTitular == "Restrição Impeditiva") { 
				
				console.log("Titular com restrição");
				roteamento = "Preencher Parecer e Referências"; 
			
			}

		}

		// Titular com procurador/rep. legal
		else if (possuiProcRep == "Sim") {

			console.log("Possui procurador");

			// Titular e procurador sem restrição, com capital não exige parecer e referência
			if ((restricaoTitular != "Restrição Impeditiva" && restricaoProcRep != "Restrição Impeditiva") && (capitalTitular == "Sim" && capitalProcRep == "Sim")) {

				console.log("Procurador e titular sem restrição área com capital");
				roteamento = "Abrir conta";
			}

			// Titular e procurador sem restrição, sem capital não exige parecer e referência
			else if ((restricaoTitular != "Restrição Impeditiva" && restricaoProcRep != "Restrição Impeditiva") && (capitalTitular != "Sim" || capitalProcRep != "Sim")) {

				console.log("Procurador e titular sem restrição sem capital");
				roteamento = "Aprovar Abertura de Conta - Gerente";
			}			

			// Titular ou procurador com restrição - exige parecer e referências
			else if (restricaoTitular == "Restrição Impeditiva" || restricaoProcRep == "Restrição Impeditiva") {
				
				console.log("Procurador ou titular com restrição");
				roteamento = "Preencher Parecer e Referências";
			}

		}

		console.log("Tipo de Rota - Final da Validação Titular Principal: " + roteamento);

		if (roteamento != "Preencher Parecer e Referências") {

			console.log("Início Validação Titulares Adicionais");

			var gridOutrosTitutlares = Form.grids("GRID_OUTROS_T").dataRows();

			for (var i = 0; i < gridOutrosTitutlares.length; i++) {

				var restricaoTitularAdd = gridOutrosTitutlares[i].OUTRO_TITU_RESTRICOES;
				var capitalTitularAdd   = gridOutrosTitutlares[i].CAPITAL;

				console.log("Linha: " + i);
				console.log("Restricao Titular Adicional: " + restricaoTitularAdd);
				console.log("Capital Titular Adicional: " + capitalTitularAdd);

				// Titular adicional sem restrição
				if (restricaoTitularAdd != "Restrição Impeditiva") {

					// Valida se a validação anterior é igual a Preencher Parecer e Referências
					if (roteamento == "Preencher Parecer e Referências") {
						roteamento = "Preencher Parecer e Referências";
					}
					// Valida se a rota anterior é igual a Preencher Parecer
					else if (roteamento == "Preencher Parecer") {
						roteamento = "Preencher Parecer";
					}
					// Valida se a rota anterior é igual a Aprovar Gerente
					else if (roteamento == "Aprovar Abertura de Conta - Gerente") {
						roteamento = "Aprovar Abertura de Conta - Gerente";
					}						
					// Valida se a rota anterior é igual a Abrir conta e confere o capital
					else if(roteamento == "Abrir conta" && capitalTitularAdd == "Sim") {
						roteamento = "Abrir conta";
					}
					// Se não foi enquadrada nos niveis maiores entra na validação real
					else{
						roteamento = "Aprovar Abertura de Conta - Gerente";
					}
				}

				// Titular adicional com restrição
				else if (restricaoTitularAdd == "Restrição Impeditiva") {
					roteamento = "Preencher Parecer e Referências";
				}

				console.log("Tipo de Rota - Final da Validação Titulares Adicionais: " + roteamento);

				// Interromper validação caso seja identificado algum titular com restrição
				if (roteamento == "Preencher Parecer e Referências") { break; }

			}

			console.log("Fim da Validação Titulares Adicionais");

		}

		debugger;

	}

	Form.fields("AUX_ROTEAMENTO_APOS_CRL").value(roteamento);
	Form.apply();

	debugger;

	return roteamento;

}