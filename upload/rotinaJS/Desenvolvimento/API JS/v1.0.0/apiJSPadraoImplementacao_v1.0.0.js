$(document).ready(function() {
	//SOMA VALOR GRID AO SUBMETER OU ATUALIZAR
	Form.grids("GRID_SOMAR_VALOR").subscribe('GRID_SUBMIT', function (dadosInstancia, nomeGrid, valoresGrid) {
		Form.apply().then( function() {
			var retorno = JSPadrao.somaValorGrid({"grid" : "GRID_SOMAR_VALOR",  "campo" : "VALOR", "campoTotal" : "TOTAL_VALOR" });
			console.log("GRID_SOMAR_VALOR: " + retorno);
		});
	});
	
	//ATUALIZA VALOR TOTAL AO REMOVER LINHA DA GRID
	Form.grids("GRID_SOMAR_VALOR").subscribe('GRID_DESTROY', function (dadosInstancia, nomeGrid, valoresGrid) {
		Form.apply().then( function() {
			var retorno = JSPadrao.somaValorGrid({"grid" : "GRID_SOMAR_VALOR",  "campo" : "VALOR", "campoTotal" : "TOTAL_VALOR" });
			console.log("GRID_SOMAR_VALOR REMOVER: " + retorno);
		});
	});
	
	//VALIDA SE A DATA SELECIONADA/DIGITADA É MENOR QUE A DATA ATUAL
	Form.fields("DATA_MENOR_ATUAL").subscribe('BLUR', function (dadosInstancia, nomeCampo, valorCampo) {
		Form.apply().then( function() {
			var retorno = JSPadrao.validaDataMenorQueAtual({"campo" : "DATA_MENOR_ATUAL"});
			console.log("DATA_MENOR_ATUAL: " + retorno);
			
			retorno = JSPadrao.getDiferencaEntreDataConfig({"campoDataInicial" : "DATA_MENOR_ATUAL", "campoDataFinal" : "DATA_MAIOR_ATUAL"});
			
			if (retorno != null && retorno != undefined) {
				console.log("Retorno Após obter a diferença de dias: " + retorno);
				Form.fields("DIAS_DIFF").value(retorno).apply();
			}
		});
	});
	
	//VALIDA SE A DATA SELECIONADA/DIGITADA É MAIOR QUE A DATA ATUAL
	Form.fields("DATA_MAIOR_ATUAL").subscribe('BLUR', function (dadosInstancia, nomeCampo, valorCampo) {
		Form.apply().then( function() {
			var retorno = JSPadrao.validaDataMaiorQueAtual({"campo" : "DATA_MAIOR_ATUAL"});
			console.log("DATA_MAIOR_ATUAL: " + retorno);
			
			retorno = JSPadrao.getDiferencaEntreDataConfig({"campoDataInicial" : "DATA_MENOR_ATUAL", "campoDataFinal" : "DATA_MAIOR_ATUAL"});
			console.log("Retorno Após obter a diferença de dias: " + retorno);
			Form.fields("DIAS_DIFF").value(retorno).apply();
		});
	});
	
	//CALDULA A IDADE A PARTIR DATA SELECIONADA/DIGITADA
	Form.fields("DATA_A_SOMAR").subscribe('BLUR', function (dadosInstancia, nomeCampo, valorCampo) {
		Form.apply().then( function() {
			var retorno = JSPadrao.somaDiasCorridos({"campo" : "DATA_A_SOMAR", "campoNovaData" : "NOVA_DATA_SOMADA", "dias" : "3"});
			console.log("Retorno Após somar 3 dias corridos: " + retorno);
			
			retorno = JSPadrao.somaDiasUteis({"campo" : "DATA_A_SOMAR", "campoNovaData" : "NOVA_DATA_DIAS_UTEIS", "dias" : "3"});
			console.log("Retorno Após somar 3 dias uteis: " + retorno);
		});
	});
	
	//CALDULA A IDADE A PARTIR DATA SELECIONADA/DIGITADA
	Form.fields("DATA_NASCIMENTO").subscribe('BLUR', function (dadosInstancia, nomeCampo, valorCampo) {
		Form.apply().then( function() {
			var retorno = JSPadrao.calculaIdade({"campo" : "DATA_NASCIMENTO", "campoIdade" : "IDADE"});
			console.log("IDADE: " + retorno);
		});
	});
	
	//VALIDA SE A DATA SELECIONADA/DIGITADA É NÃO CAIU NO FIM DE SEMANA
	Form.fields("DATA_FIM_SEMANA").subscribe('BLUR', function (dadosInstancia, nomeCampo, valorCampo) {
		Form.apply().then( function() {
			var retorno = JSPadrao.validaDataFinalDeSemana({"campo" : "DATA_FIM_SEMANA"});
			console.log("DATA_FIM_SEMANA: " + retorno);
		});
	});
	
	//VALIDA SE A HORA É VALIDA
	Form.fields("HORA").subscribe('BLUR', function (dadosInstancia, nomeCampo, valorCampo) {
		Form.apply().then( function() {
			var retorno = JSPadrao.validaHora({"campo" : "HORA"});
			console.log("HORA: " + retorno);
		});
	});
	
	//VALIDA SE O EMAIL É VÁLIDO
	Form.fields("EMAIL").subscribe('BLUR', function (dadosInstancia, nomeCampo, valorCampo) {
		Form.apply().then( function() {
			var retorno = JSPadrao.validaEmail({"campo" : "EMAIL"});
			console.log("EMAIL: " + retorno);
		});
	});
	
	//VALIDA SE O CNPJ É VÁLIDO
	Form.fields("CNPJ").subscribe('BLUR', function (dadosInstancia, nomeCampo, valorCampo) {
		Form.apply().then( function() {
			var retorno = JSPadrao.validaCNPJ({"campo" : "CNPJ"});
			console.log("CNPJ: " + retorno);
		});
	});
	
	//VALIDA SE O CPF É VÁLIDO
	Form.fields("CPF").subscribe('BLUR', function (dadosInstancia, nomeCampo, valorCampo) {
		Form.apply().then( function() {
			var retorno = JSPadrao.validaCPF({"campo" : "CPF"});
			console.log("CPF: " + retorno);
		});
	});
	
	//VALIDA SE O CNPJ É VÁLIDO
	Form.fields("PIS").subscribe('BLUR', function (dadosInstancia, nomeCampo, valorCampo) {
		Form.apply().then( function() {
			var retorno = JSPadrao.validaPIS({"campo" : "PIS"});
			console.log("PIS: " + retorno);
		});			
	});
	
	//CALCULA DIFERENÇA DE DIAS ENTRE OS CAMPOS DATA_MENOR_ATUAL E DATA_MAIOR_ATUAL
	Form.fields("DIAS_DIFF").subscribe('BLUR', function (dadosInstancia, nomeCampo, valorCampo) {
		Form.apply().then( function() {
			var retorno = JSPadrao.getDiferencaEntreDataConfig({"campoDataInicial" : "DATA_MENOR_ATUAL", "campoDataFinal" : "DATA_MAIOR_ATUAL"});
			console.log("Retorno Após obter a diferença de dias: " + retorno);
			Form.fields("DIAS_DIFF").value(retorno).apply();
		});
	});
	
	//VALIDA A EXTENSÃO DO ARQUIVO
	Form.fields("EXTENSAO_ARQUIVO").subscribe('DOCUMENT_IMPORT_FILE_SUBMITTED', function (dadosInstancia, nomeCampo, file) {
		JSPadrao.validarExtensaoArquivo({"file": file, "extensoes" : "docx,pdf"});
		console.log("Validou campo com a extensão");
	});
	
	//VALIDA O TAMANHO DO ARQUIVO ANEXADO
	Form.fields("TAMANHO_ARQUIVO").subscribe('DOCUMENT_IMPORT_FILE_SUBMITTED', function (dadosInstancia, nomeCampo, file) {
		JSPadrao.validarTamanhoArquivo({"file": file, "tamanho" : "1"});
		console.log("Validou campo com o tamanho");
	});
	
	//VALIDA O TAMANHO DO ARQUIVO ANEXADO
	Form.fields("EMAIL").subscribe('BLUR', function (dadosInstancia, nomeCampo, file) {
		JSPadrao.limparOpcoesCampoLista({"campo": "ADICIONAR_DADOS_LISTA"});
		console.log("Limpou campo Lista");
		JSPadrao.adicionaOpcoesCampoLista({"campo": "ADICIONAR_DADOS_LISTA", "opcoesLista" : ";Valor 1;Valor 2;Valor 3;"});
		console.log("Adicionar valores no campo Lista");
	});
	
	//VALIDA SE A GRID TEM AO MENOS X ITENS
	JSPadrao.validaPreenchimentoMinimoItensGRID({"grid" : "GRID_SOMAR_VALOR", "quantidade" : "3"});
});