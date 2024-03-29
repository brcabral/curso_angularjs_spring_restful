package curso.angular.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

import curso.angular.dao.DaoImplementacao;
import curso.angular.dao.DaoInterface;
import curso.angular.model.ItemPedido;
import curso.angular.model.Pedido;
import curso.angular.model.PedidoBean;

@Controller
@RequestMapping(value = "/pedido")
public class PedidoController extends DaoImplementacao<Pedido> implements DaoInterface<Pedido> {
	@Autowired
	private ItemPedidoController itemPedidoController;

	public PedidoController(Class<Pedido> persistenceClass) {
		super(persistenceClass);
	}

	@ResponseBody
	@RequestMapping(value = "finalizar", method = RequestMethod.POST)
	public String finalizarPedido(@RequestBody String jsonPedido) throws Exception {
		PedidoBean pedidoBean = new Gson().fromJson(jsonPedido, PedidoBean.class);

		Pedido pedido = pedidoBean.getPedido();
		pedido = super.merge(pedido);

		List<ItemPedido> itensPedido = pedidoBean.getItens();
		for (ItemPedido itemPedido : itensPedido) {
			itemPedido.setPedido(pedido);
			itemPedidoController.salvar(itemPedido);
		}

		return pedido.getId().toString();
	}

	@ResponseBody
	@RequestMapping(value = "listar", method = RequestMethod.GET, headers = "Accept=application/json")
	public String listar() throws Exception {
		return new Gson().toJson(super.lista());
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "grafico", method = RequestMethod.GET)
	public @ResponseBody String grafico() {
		String sql = "select trunc(avg(ip.quantidade),2) as media, l.titulo from livro l "
				+ " inner join  itempedido ip on ip.livro_id = l.id group by l.id";

		List<Object[]> lista = getSessionFactory().getCurrentSession().createSQLQuery(sql).list();

		Object[] retorno = new Object[lista.size() + 1];
		int cont = 0;

		retorno[cont] = "[\"" + "Livro" + "\"," + "\"" + "Quantidade " + "\"]";
		cont++;

		for (Object[] object : lista) {
			retorno[cont] = "[\"" + object[1] + "\"," + "\"" + object[0] + "\"]";
			cont++;
		}

		return Arrays.toString(retorno);
	}
}
