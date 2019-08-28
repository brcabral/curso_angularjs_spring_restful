package curso.angular.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

import curso.angular.dao.DaoImplementacao;
import curso.angular.dao.DaoInterface;
import curso.angular.model.Fornecedor;

@Controller
@RequestMapping(value = "/fornecedor")
public class FornecedorController extends DaoImplementacao<Fornecedor> implements DaoInterface<Fornecedor> {

	public FornecedorController(Class<Fornecedor> persistenceClass) {
		super(persistenceClass);
	}

	@ResponseBody
	@RequestMapping(value = "salvar", method = RequestMethod.POST)
	public ResponseEntity<Fornecedor> salvar(@RequestBody String jsonFornecedor) throws Exception {
		Fornecedor fornecedor = new Gson().fromJson(jsonFornecedor, Fornecedor.class);

		if (fornecedor != null && fornecedor.getAtivo() == null) {
			fornecedor.setAtivo(false);
		}

		super.salvarOuAtualizar(fornecedor);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "deletar/{codFornecedor}", method = RequestMethod.DELETE)
	public @ResponseBody String deletar(@PathVariable("codFornecedor") String codFornecedor) throws Exception {
		super.deletar(loadObjeto(Long.parseLong(codFornecedor)));
		return null;
	}

	@ResponseBody
	@RequestMapping(value = "listar/{numeroPagina}", method = RequestMethod.GET, headers = "Accept=application/json")
	public String listar(@PathVariable("numeroPagina") String numeroPagina) throws Exception {
		return new Gson().toJson(super.consultaPaginada(numeroPagina));
	}

	@ResponseBody
	@RequestMapping(value = "totalPagina", method = RequestMethod.GET)
	public String totalPagina() throws Exception {
		return Integer.toString(super.quantidadePagina());
	}

	@ResponseBody
	@RequestMapping(value = "listartodos", method = RequestMethod.GET, headers = "Accept=application/json")
	public String listarTodos() throws Exception {
		return new Gson().toJson(super.lista());
	}

	@RequestMapping(value = "buscarfornecedor/{codFornecedor}", method = RequestMethod.GET)
	public @ResponseBody String buscarFornecedor(@PathVariable("codFornecedor") String codFornecedor) throws Exception {
		Fornecedor fornecedor = super.loadObjeto(Long.parseLong(codFornecedor));
		if (fornecedor == null) {
			return "{}";
		}
		return new Gson().toJson(fornecedor);
	}
}
