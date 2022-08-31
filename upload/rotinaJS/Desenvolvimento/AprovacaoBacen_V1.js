$(document).ready( function() {
	setEventos();
	setForm();
	setValidators();

	Form.apply().then( function() {
		defineLabels();
		initLayout();
	});
});


// Dados da atividade
var codigoProcesso = ProcessData.processInstanceId;
var codigoEtapa    = ProcessData.activityInstanceId;
var codigoCiclo    = ProcessData.cycle;


//Atividades do processo
var SOLICITAR_APROVACAO = 1;

/*
 * Inicializa layout geral
 */
function initLayout(){

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

	// Atividade 01 - Solicitar aprovação Bacen
	if (codigoEtapa == SOLICITAR_APROVACAO) {

		var pessoa;
		var str;
		var retorno;

		// Remover máscara CPF/CNPJ
		Form.grids("GRID_DADOS").fields("CPF_CNPJ").subscribe("FOCUS", function (itemId, data, response) {

			Form.grids("GRID_DADOS").fields("CPF_CNPJ").removeMask().apply();

		});

		// Tratamento campo CPF/CNPJ
		Form.grids("GRID_DADOS").fields("CPF_CNPJ").subscribe("BLUR", function (itemId, data, response) {
			
			// Recebe valor do campo da grid e remove . - e /
			pessoa = Form.grids("GRID_DADOS").fields("CPF_CNPJ").value();
			str    = pessoa.replace(/\.|\-|\//g, '');

			console.log("Pessoa: "  + str);
			console.log("Tamanho: " + str.length);

			// Validar CPF
			if(str.length == 11){

				retorno = testarCPF(str);	
				console.log("Valido: " + retorno);

				if(retorno){
					Form.grids("GRID_DADOS").fields('CPF_CNPJ').mask('cpf').apply();
					Form.grids("GRID_DADOS").fields("CPF_CNPJ").errors("");
				} else{
					Form.grids("GRID_DADOS").fields("CPF_CNPJ").value("").apply();
					Form.grids("GRID_DADOS").fields("CPF_CNPJ").errors("CPF inválido.");
				}	

			} else

			// Validar CNPJ
			if(str.length == 14){

				retorno = testarCNPJ(str);	
				console.log("Valido: " + retorno);

				if(retorno){
					Form.grids("GRID_DADOS").fields('CPF_CNPJ').mask('cnpj').apply();
					Form.grids("GRID_DADOS").fields("CPF_CNPJ").errors("");
				} else{
					Form.grids("GRID_DADOS").fields("CPF_CNPJ").value("").apply();
					Form.grids("GRID_DADOS").fields("CPF_CNPJ").errors("CNPJ inválido.");
				}				

			} else

			// Não é CPF nem CNPJ
			if(str.lenght != 11 && str.lenght != 14 && str.lenght != 0){

				Form.grids("GRID_DADOS").fields("CPF_CNPJ").value("").apply();
				Form.grids("GRID_DADOS").fields("CPF_CNPJ").errors("Documento inválido");

			}

		});	
		
	}
	
	Form.apply();
}

/*
 * Formata o formulário
 */
function setForm(){

}

/*
 * Define novas regras de validação dos campos
 */
function setValidators(){

	// Validar conteúdo da grid
	if(codigoEtapa == SOLICITAR_APROVACAO){
		
		Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject){

			debugger;

			if (!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "GRID_DADOS", "quantidade": "1" })) {
				reject();
				Form.apply();
			}

		});

	}

}

// Validador de CPF
function testarCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
	if (
        strCPF == "00000000000" ||
        strCPF == "11111111111" ||
        strCPF == "22222222222" ||
        strCPF == "33333333333" ||
        strCPF == "44444444444" ||
        strCPF == "55555555555" ||
        strCPF == "66666666666" ||
        strCPF == "77777777777" ||
        strCPF == "88888888888" ||
        strCPF == "99999999999" ){
        return false;
    }

  	for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
  		Resto = (Soma * 10) % 11;

    	if ((Resto == 10) || (Resto == 11))  Resto = 0;
    	if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

  	Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    	Resto = (Soma * 10) % 11;

    	if ((Resto == 10) || (Resto == 11))  Resto = 0;
    	if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}

// Validador de CNPJ
function testarCNPJ(cnpj) {
 
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999" ){
        return false;
	}	
         
    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;
         
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;
           
    return true;
    
}