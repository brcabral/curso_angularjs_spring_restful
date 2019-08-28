// configurações do controller da loja de livros
app.controller("lojaController", function($scope, $http, $location, $routeParams) {
	if ($routeParams.codigoPedido != null) {
		$scope.codigoPedido = $routeParams.codigoPedido;
	}

	if ($routeParams.itens != null && $routeParams.itens.length > 0) {
		$http.get("itempedido/processar/" + $routeParams.itens).success(function(response) {
			$scope.itensCarrinho = response;
			$scope.pedidoObjeto = response[0].pedido;
		}).error(function(response) {
			erro("Erro ao adicionar os livros no carrinho! \n Erro: " + response);
		});
	} else {
		$scope.carrinhoLivro = new Array();
	}

	$scope.listarLivros = function(numeroPagina) {
		$scope.numeroPagina = numeroPagina;
		$http.get("livro/listar/" + numeroPagina).success(function(response) {
			$scope.data = response;

			// ------------ Início total página ------------
			$http.get("livro/totalPagina").success(function(response) {
				$scope.totalPagina = response;
			}).error(function(response) {
				erro("Erro ao verificar a quantidade de páginas! \n Erro: " + response);
			});
			// ------------ Fim total página ------------
		}).error(function(response) {
			erro("Erro ao listar os livros! \n Erro: " + response);
		});
	};
	
	$scope.addLivro = function(livroid) {
		$scope.carrinhoLivro.push(livroid);
	};

	$scope.removerLivroCarrinho = function(livroid) {
		$scope.itensTemp = new Array();
		var valorTotal = new Number();
		for (var i = 0; i < $scope.itensCarrinho.length; i++) {
			if ($scope.itensCarrinho[i].livro.id === livroid) {
				//
			} else {
				$scope.itensTemp.push($scope.itensCarrinho[i]);
				var valorLivro = $scope.itensCarrinho[i].livro.preco.replace("R", "").replace("$", "").replace(".", "").replace(",", ".");
				valorTotal += parseFloat(valorLivro * $scope.itensCarrinho[i].quantidade);
			}
		}
		$scope.pedidoObjeto.valorTotal = "R$ " + valorTotal.toString();
		$scope.itensCarrinho = $scope.itensTemp;
	};

	$scope.recalculo = function(quantidade, livro) {
		var valorTotal = new Number();
		for (var i = 0; i < $scope.itensCarrinho.length; i++) {
			var valorLivro = $scope.itensCarrinho[i].livro.preco.replace("R", "").replace("$", "").replace(".", "").replace(",", ".");
			if ($scope.itensCarrinho[i].livro.id == livro) {
				valorTotal += parseFloat(valorLivro * quantidade);
			} else {
				valorTotal += parseFloat(valorLivro * $scope.itensCarrinho[i].quantidade);
			}
		}
		$scope.pedidoObjeto.valorTotal = "R$ " + valorTotal.toString();
	};

	$scope.fecharPedido = function() {
		$location.path('loja/itensLoja/' + $scope.carrinhoLivro);
	};
	
	$scope.buscarClientePorNome = function() {
		$http.get("cliente/buscarnome/" + $scope.filtroCliente).success(function(response) {
			$scope.clientes = response;
		}).error(function(response) {
			erro("Erro ao pesquisar cliente! \n Erro: " + response);
		});
	};
	
	$scope.adicionarCliente = function(cliente) {
		$scope.pedidoObjeto.cliente = cliente;
		$scope.clientePedido = cliente;
		$scope.filtroCliente = "";
		$scope.clientes = {};
	};
	
	$scope.finalizarPedido = function() {
		$scope.pedidoObjeto.cliente = $scope.clientePedido;
		$http.post("pedido/finalizar", {"pedido" : $scope.pedidoObjeto, "itens" : $scope.itensCarrinho}).success(function(response) {
			$scope.pedidoObjeto = {};
			$scope.itensCarrinho = {};

			$location.path("loja/pedidoconfirmado/" + response);

			sucesso("Pedido finalizado!");
		}).error(function(response) {
			erro("Erro ao pesquisar cliente! \n Erro: " + response);
		})
	};

	$scope.listarPedidos = function() {
		$http.get("pedido/listar/").success(function(response) {
			$scope.pedidos = response;
		}).error(function(response) {
			erro("Erro ao pesquisar os pedidos! \n Erro: " + response);
		});
	};

	$scope.anterior = function() {
		if (new Number($scope.numeroPagina) > 1) {
			$scope.listarLivros(new Number($scope.numeroPagina - 1));
		}
	};
	
	$scope.proximo = function() {
		if (new Number($scope.numeroPagina) < new Number($scope.totalPagina)) {
			$scope.listarLivros(new Number($scope.numeroPagina + 1));
		}
	};
});