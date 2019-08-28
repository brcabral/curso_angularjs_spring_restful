var app = angular.module('loja', [ 'ngRoute', 'ngResource', 'ngAnimate' ]);

// Configurando as rotas

app.config(function($routeProvider, $provide, $httpProvider, $locationProvider) {
	// ---------- Cliente ----------
	// listar cliente
	$routeProvider.when("/clientelist", {
		controller : "clienteController",
		templateUrl : "cliente/list.html"
	// editar cliente
	}).when("/clienteedit/:id", {
		controller : "clienteController",
		templateUrl : "cliente/cadastro.html"
	// inserir cliente
	}).when("/cliente/cadastro", {
		controller : "clienteController",
		templateUrl : "cliente/cadastro.html"
	})
	// ---------- Fornecedor ----------
	// listar fornecedor
	$routeProvider.when("/fornecedorlist", {
		controller : "fornecedorController",
		templateUrl : "fornecedor/list.html"
	// editar fornecedor
	}).when("/fornecedoredit/:id", {
		controller : "fornecedorController",
		templateUrl : "fornecedor/cadastro.html"
	// inserir fornecedor
	}).when("/fornecedor/cadastro", {
		controller : "fornecedorController",
		templateUrl : "fornecedor/cadastro.html"
	})
	// ---------- Livro ----------
	// listar livro
	$routeProvider.when("/livrolist", {
	    controller : "livroController",
	    templateUrl : "livro/list.html"
	// editar livro
	}).when("/livroedit/:id", {
	    controller : "livroController",
	    templateUrl : "livro/cadastro.html"
	// inserir livro
	}).when("/livro/cadastro", {
	    controller : "livroController",
	    templateUrl : "livro/cadastro.html"
	})
	// ---------- Loja ----------
	$routeProvider.when("/loja/online", {
	    controller : "lojaController",
	    templateUrl : "loja/online.html"
	// carrinhos de livros
	}).when("/loja/itensLoja/:itens", {
	    controller : "lojaController",
	    templateUrl : "loja/itensLoja.html"
	// pedido finalizado
	}).when("/loja/pedidoconfirmado/:codigoPedido", {
	    controller : "livroController",
	    templateUrl : "loja/pedidoconfirmado.html"
	// listar todos os pedidos
	}).when("/loja/pedidos", {
	    controller : "livroController",
	    templateUrl : "loja/pedidos.html"
	// listar todos os pedidos
	}).when("/grafico/media_pedido", {
	    controller : "livroController",
	    templateUrl : "grafico/media_pedido.html"
	})
	
	.otherwise({
		redirectTo : "/"
	});
});

// configurações do controller de cliente
app.controller("clienteController", function($scope, $http, $location, $routeParams) {	
	$scope.cliente = {};
	
	$scope.salvarCliente = function() {
		$scope.cliente.foto = document.getElementById("imagemCliente").getAttribute("src");		
		
		$http.post("cliente/salvar", $scope.cliente).success(function(response) {
			$scope.cliente = {};
			document.getElementById("imagemCliente").src = '';
			sucesso("Cliente salvo com sucesso!");
		}).error(function(data, status, headers, config) {
			erro("Erro ao salvar cliente! \n Erro: " + response);
		});
	};
	
	if ($routeParams.id != null && $routeParams.id != '' && $routeParams.id != undefined) {
		$http.get("cliente/buscarcliente/" + $routeParams.id).success(function(response) {
			$scope.cliente = response;
			
			document.getElementById("imagemCliente").src = $scope.cliente.foto;
			// ---------- carregar estado e cidade do cliente ----------
			setTimeout(function() {
				$("#selectEstados").prop('selectedIndex', (new Number($scope.cliente.estados.id) + 1));
				
				$http.get("cidades/listar/" + $scope.cliente.estados.id).success(function(response) {
					$scope.cidades = response;
					setTimeout(function() {
						$("#selectCidades").prop('selectedIndex', buscarKeyJson(response, 'id', $scope.cliente.cidades.id));
					}, 1000);
				}).error(function(data, status, headers, config) {
					erro("Erro as cidades! \n Erro: " + response);
				});

			}, 1000);
			// ---------------------------------------------------------
			
			
		}).error(function(data, status, headers, config) {
			erro("Erro ao pesquisar cliente! \n Erro: " + response);
		});
		
	} else {
		$scope.cliente = {};
	}
	
	$scope.editarCliente = function(id) {
		$location.path("clienteedit/" + id);
	};

	$scope.removerCliente = function(codCliente) {
		$http.delete("cliente/deletar/" + codCliente).success(function(response) {
			$scope.listarClientes($scope.numeroPagina);
			sucesso("Cliente removido com sucesso!");
		}).error(function(data, status, headers, config) {
			erro("Erro ao remover cliente! \n Erro: " + response);
		});
	};
	
	$scope.listarClientes = function(numeroPagina) {
		$scope.numeroPagina = numeroPagina;
		$http.get("cliente/listar/" + numeroPagina).success(function(response) {
			$scope.data = response;

			// ------------ Início total página ------------
			$http.get("cliente/totalPagina").success(function(response) {
				$scope.totalPagina = response;
			}).error(function(response) {
				erro("Erro ao verificar a quantidade de páginas! \n Erro: " + response);
			});
			// ------------ Fim total página ------------
		}).error(function(response) {
			erro("Erro ao listar os clientes! \n Erro: " + response);
		});
	};
	
	$scope.anterior = function() {
		if (new Number($scope.numeroPagina) > 1) {
			$scope.listarClientes(new Number($scope.numeroPagina - 1));
		}
	};
	
	$scope.proximo = function() {
		if (new Number($scope.numeroPagina) < new Number($scope.totalPagina)) {
			$scope.listarClientes(new Number($scope.numeroPagina + 1));
		}
	};

	$scope.carregarEstados = function() {
		$scope.estados = [{}];
		$http.get("estados/listar").success(function(response) {
			$scope.estados = response;
		}).error(function(response) {
			erro("Erro ao listar os estados! \n Erro: " + response);
		});
	};

	$scope.carregarCidades = function(estado) {
		if (identificarNavegador() != 'chrome') {
			console.log(estado);
			$http.get("cidades/listar/" + estado.id).success(function(response) {
				$scope.cidades = response;
			}).error(function(data, status, headers, config) {
				erro("Erro ao listar as cidades! \n Erro: " + response);
			});
		}		
	};
});

// configurações do controller de fornecedor
app.controller("fornecedorController", function($scope, $http, $location, $routeParams) {	
	$scope.fornecedor = {};
	
	$scope.salvarFornecedor = function() {
		$scope.fornecedor.foto = document.getElementById("imagemFornecedor").getAttribute("src");		
		
		$http.post("fornecedor/salvar", $scope.fornecedor).success(function(response) {
			$scope.fornecedor = {};
			document.getElementById("imagemFornecedor").src = '';
			sucesso("Fornecedor salvo com sucesso!");
		}).error(function(data, status, headers, config) {
			erro("Erro ao salvar fornecedor! \n Erro: " + response);
		});
	};
	
	if ($routeParams.id != null && $routeParams.id != '' && $routeParams.id != undefined) {
		$http.get("fornecedor/buscarfornecedor/" + $routeParams.id).success(function(response) {
			$scope.fornecedor = response;
			
			document.getElementById("imagemFornecedor").src = $scope.fornecedor.foto;
			// ---------- carregar estado e cidade do fornecedor ----------
			setTimeout(function() {
				$("#selectEstados").prop('selectedIndex', (new Number($scope.fornecedor.estados.id) + 1));
				
				$http.get("cidades/listar/" + $scope.fornecedor.estados.id).success(function(response) {
					$scope.cidades = response;
					setTimeout(function() {
						$("#selectCidades").prop('selectedIndex', buscarKeyJson(response, 'id', $scope.fornecedor.cidades.id));
					}, 1000);
				}).error(function(data, status, headers, config) {
					erro("Erro as cidades! \n Erro: " + response);
				});

			}, 1000);
			// ---------------------------------------------------------
			
			
		}).error(function(data, status, headers, config) {
			erro("Erro ao pesquisar fornecedor! \n Erro: " + response);
		});
		
	} else {
		$scope.fornecedor = {};
	}
	
	$scope.editarFornecedor = function(id) {
		$location.path("fornecedoredit/" + id);
	};

	$scope.removerFornecedor = function(codFornecedor) {
		$http.delete("fornecedor/deletar/" + codFornecedor).success(function(response) {
			$scope.listarFornecedores($scope.numeroPagina);
			sucesso("Fornecedor removido com sucesso!");
		}).error(function(data, status, headers, config) {
			erro("Erro ao remover fornecedor! \n Erro: " + response);
		});
	};
	
	$scope.listarFornecedores = function(numeroPagina) {
		$scope.numeroPagina = numeroPagina;
		$http.get("fornecedor/listar/" + numeroPagina).success(function(response) {
			$scope.data = response;

			// ------------ Início total página ------------
			$http.get("fornecedor/totalPagina").success(function(response) {
				$scope.totalPagina = response;
			}).error(function(response) {
				erro("Erro ao verificar a quantidade de páginas! \n Erro: " + response);
			});
			// ------------ Fim total página ------------
		}).error(function(response) {
			erro("Erro ao listar os fornecedores! \n Erro: " + response);
		});
	};
	
	$scope.anterior = function() {
		if (new Number($scope.numeroPagina) > 1) {
			$scope.listarFornecedores(new Number($scope.numeroPagina - 1));
		}
	};
	
	$scope.proximo = function() {
		if (new Number($scope.numeroPagina) < new Number($scope.totalPagina)) {
			$scope.listarFornecedores(new Number($scope.numeroPagina + 1));
		}
	};

	$scope.carregarEstados = function() {
		$scope.estados = [{}];
		$http.get("estados/listar").success(function(response) {
			$scope.estados = response;
		}).error(function(response) {
			erro("Erro ao listar os estados! \n Erro: " + response);
		});
	};

	$scope.carregarCidades = function(estado) {
		if (identificarNavegador() != 'chrome') {
			console.log(estado);
			$http.get("cidades/listar/" + estado.id).success(function(response) {
				$scope.cidades = response;
			}).error(function(data, status, headers, config) {
				erro("Erro ao listar as cidades! \n Erro: " + response);
			});
		}		
	};
});

function sucesso(msg) {
	$.notify({
		message: msg
	},{
		type : 'success',
		timer: 1500
	});
}

function erro(msg) {
	$.notify({
		message: msg
	},{
		type : 'danger',
		timer: 1500
	});
}

function buscarKeyJson(obj, key, value) {
	for (var i = 0; i < obj.length; i++) {
		if (obj[i][key] == value) {
			return i + 2;
		}
	}
	return null;
}

// identificar navegador
function identificarNavegador(){
    var nav = navigator.userAgent.toLowerCase();
    if(nav.indexOf("msie") != -1){
       return browser = "msie";
    }else if(nav.indexOf("opera") != -1){
    	return browser = "opera";
    }else if(nav.indexOf("mozilla") != -1){
        if(nav.indexOf("firefox") != -1){
        	return  browser = "firefox";
        }else if(nav.indexOf("firefox") != -1){
        	return browser = "mozilla";
        }else if(nav.indexOf("chrome") != -1){
        	return browser = "chrome";
        }
    }else{
    	alert("Navegador desconhecido!");
    }
}
// carregar cidades quando o navegador for Chrome (usando JQuery)
function carregarCidadesChrome(estado) {
	if (identificarNavegador() === 'chrome') {
		$.get("cidades/listarchrome", { idEstado: estado.value}, function(data) {
			var json = JSON.parse(data);
			html = '<option value="">--Selecione--</option>';
			for (var i = 0; i < json.length; i++) {
				html += '<option value=' + json[i].id + '>' + json[i].nome + '</option>';
			}
			$('#selectCidades').html(html);
		});
	}
}

// adiciona a imagem ao campo html img
function visualizarImg() {
	var preview = document.querySelectorAll('img').item(2);
	var file = document.querySelector('input[type=file]').files[0];
	var reader = new FileReader();
	
	reader.onloadend = function() {
		// carrega em base64 a img
		preview.src = reader.result;
	};
	
	if (file) {
		reader.readAsDataURL(file);
	} else {
		preview.src = "";
	}
}
