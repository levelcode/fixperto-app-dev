import React, { Component } from 'react';
import { View, ScrollView, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AlertModal from "../../componentes/alertView";
import { url } from "../../componentes/config";
export default class DatosClienteVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, customer: {}, comments: [] } }
	componentDidMount() { this.getDatos(); }
	getDatos = () => {
		return fetch(url + 'cliente/getCustomerData', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ customer: this.props["navigation"].getParam("customer") })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				this.setState({ customer: responseJson.customer, comments: responseJson.comments });
			}
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		}).catch((error) => {
			if (error.message === 'Timeout' || error.message === 'Network request failed') {
				this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
			}
		})
	}
	render() {
		const { customer, comments } = this.state;
		return (
			<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 5, padding: 10, paddingTop: 20 }}>
					<View style={{ flex: 0.3, borderRadius: 5, alignItems: "center" }}>
						<Image style={{ width: 100, height: 100, borderRadius: 10 }}
							source={{ uri: url + "uploads/registros/cliente/" + customer["avatar"] }}>
						</Image>
					</View>
					<View style={{ marginBottom: 5, flex: 0.7, flexDirection: "row" }}>
						<Text style={{ flex: 0.8, fontFamily: "Raleway-Bold", fontSize: 17, marginLeft: 5, color: "#252C42" }}>{customer.name}</Text>
						<View style={{ flex: 0.3 }}>
							{
								(customer.evaluation) ?
									<Text style={[{ marginHorizontal: 0 }]}>
										<Ionicons name="ios-star" size={15} color="#FFCE07" />
										{customer.evaluation}
									</Text>
									:
									<View>
										<Text></Text>
										<Text style={[{ marginHorizontal: 0, fontSize: 10 }]}>
											<Ionicons name="ios-star" size={15} color="#FFCE07" /> Sin
									</Text>
										<Text style={[{ marginHorizontal: 0, fontSize: 10 }]}>
											calificación
									</Text>
									</View>
							}
						</View>
					</View>
				</View>
				{comments.length > 0 && <Text style={{ marginHorizontal: 10, fontSize: 20, marginBottom: 10, fontFamily: "Raleway-Bold", color: "#263762", padding: 20 }}>Comentarios de expertos</Text>}
				{comments.length > 0 && comments.map((item, index) => {
					return <View key={index} style={{ marginBottom: 20, padding: 20 }} >
						<View style={{ marginHorizontal: 10, flexDirection: "row", alignItems: "center", marginTop: 5 }}>
							{
								(item.evaluation) ?
									<Text style={[{ marginHorizontal: 0 }]}>
										<Ionicons name="ios-star" size={15} color="#FFCE07" />
										{item.evaluation}
									</Text>
									:
									<View>
										<Text></Text>
										<Text style={[{ marginHorizontal: 0, fontSize: 10 }]}>
											<Ionicons name="ios-star" size={15} color="#FFCE07" /> Sin
									</Text>
										<Text style={[{ marginHorizontal: 0, fontSize: 10 }]}>
											calificación
									</Text>
									</View>
							}
						</View>
						<Text style={{ textAlign: "justify", paddingHorizontal: 10, marginTop: 5 }}>{item.commentary}</Text>
						<Text style={{ textAlign: "justify", paddingHorizontal: 10, marginBottom: 10, color: "silver", marginTop: 3 }}>{item.name}</Text>
					</View>
				})}
			</ScrollView>
		)
	}
}