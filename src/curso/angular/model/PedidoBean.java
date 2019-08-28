package curso.angular.model;

import java.util.ArrayList;

public class PedidoBean {
	private Pedido pedido = new Pedido();
	private ArrayList<ItemPedido> itens = new ArrayList<ItemPedido>();

	public Pedido getPedido() {
		return pedido;
	}

	public void setPedido(Pedido pedido) {
		this.pedido = pedido;
	}

	public ArrayList<ItemPedido> getItens() {
		return itens;
	}

	public void setItens(ArrayList<ItemPedido> itens) {
		this.itens = itens;
	}
}
