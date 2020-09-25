import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, AsyncStorage, Text } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import Cliente from "../../../componentes/clienteVista";
import AlertModal from "../../../componentes/alertView";
import { general, info, detalle } from "../../../style/request";
import { url } from "../../../componentes/config";
export default class DetallesCompletadoOfertaVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, customer: {}, service: {}, user: {} } }
	componentDidMount() {
		AsyncStorage.getItem("@USER").then((user) => { user = JSON.parse(user); this.getOffert(user); })
	}
	verDetalle = () => { this.props["navigation"].navigate("Solicitud", { request: this.props["navigation"].getParam("item").request }); }
	verOferta = () => {
		return fetch(url + 'fixperto/getOffert', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ expert: this.state["user"]["typeId"], request: this.props["navigation"].getParam("item").request })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				this.props["navigation"].navigate("RealizarOferta", {
					offert: responseJson.offert, action: "show",
					expert: this.state["user"]["typeId"],
					request: this.props["navigation"].getParam("item").request,
					solicitud: responseJson.solicitud
				})
			}
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	calificarCliente = () => {
		this.props["navigation"].navigate("Calificar", {
			type: "experto",
			calificador: this.props["navigation"].getParam("item").id,
			calificado: this.state["customer"]
		})
	}
	getOffert = (user) => {
		return fetch(url + 'fixperto/getOffertCompleted', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id: this.props["navigation"].getParam("item").id })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.setState({ service: responseJson.service, customer: responseJson.customer, user }); }
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	render() {
		const { service, customer } = this.state;
		return (
			<ScrollView style={[general.cont3]}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<View style={{ flexDirection: "row", marginHorizontal: 1 }}>
					<View style={[general.cont, detalle.cont_detalle]}>
						<View style={{ flex: 0.3, alignItems: "center" }}>
							<View style={[info.cont_img]}>
								{(service.icon) ?
									<Image source={{ uri: service.icon }} style={{ width: 50, height: 50 }} />
									: <Image source={require("../../../assets/icon.png")} style={{ width: 50, height: 50 }} />
								}
							</View>
						</View>
						<View style={{ flex: 0.9 }}>
							<View style={[info.cont_text]}>
								{service.emergency === 1 && <View style={[general.cont2, { marginBottom: 5 }]}>
									<Image source={require("../../../assets/iconos/emergencia.png")} style={{ width: 18, height: 18 }} />
									<Text style={[info.text_esperando, { color: "#293763" }]}>Servicio de emergencia</Text>
								</View>}
								<Text style={[info.cont_text_title]}>{service["denomination"]}</Text>
								<View style={[general.cont4]}>
									<Image source={require("../../../assets/iconos/ubicacion.png")} style={[detalle.img_detalle]} />
									<Text style={[detalle.text_detalle]}>{service["zone"]}</Text>
								</View>
								<View style={[general.cont4]}>
									<Image source={require("../../../assets/iconos/calendar.png")} style={[detalle.img_detalle]} />
									<Text style={[detalle.text_detalle]}>Fecha: {service["registry_date"]}</Text>
								</View>
								<View style={[general.cont4]}>
									<Image source={require("../../../assets/iconos/calendar.png")} style={[detalle.img_detalle]} />
									<Text style={[detalle.text_detalle]}>Fecha finalizada: {(service["end_date"]) ? service["end_date"] : "Pendiente"}</Text>
								</View>
								<TouchableOpacity style={[general.cont2, general.cont4]}
									onPress={() => this.verDetalle()} >
									<Image source={require("../../../assets/iconos/mas.png")} style={[info.img_ver_mas]} />
									<Text style={info.ver_mas}>Ver detalle</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
				<Divider />
				<View style={{ flexDirection: "row", marginVertical: 20, alignItems: "center" }}>
					<Divider style={{ flex: 0.4, borderColor: "#63E2F7", borderWidth: 1 }} />
					<Text style={{ color: "#293551", fontFamily: "Raleway-Bold", textAlign: "center", flex: 0.5 }}>CLIENTE</Text>
					<Divider style={{ flex: 0.4, borderColor: "#63E2F7", borderWidth: 1 }} />
				</View>
				<ScrollView>
					<View style={[detalle.cont_contratado]}>
						<Cliente cliente={customer} navigation={this.props["navigation"]} />
						<View style={{ flexDirection: "row" }}>
							<Button containerStyle={{ flex: 0.5 }}
								buttonStyle={[detalle.button_chat]}
								icon={<Image source={require("../../../assets/iconos/mensaje.png")} style={detalle.button_chat_icon} />}
								title="Chat"
								titleStyle={[detalle.button_chat_text]}
								onPress={() => {
									this.props["navigation"].navigate("Chat", {
										chat: { to: customer, user: this.state["user"], request: this.props["navigation"].getParam("item").request, type: "experto", action: "show" }
									})
								}}
							/>
							<Button containerStyle={{ flex: 0.5 }}
								buttonStyle={{ backgroundColor: "#49B0CD", marginTop: 10 }}
								title="VER SERVICIO"
								titleStyle={{ color: "#FFFFFF", fontSize: 14 }}
								onPress={() => this.verOferta()}
							/>
						</View>
					</View>
				</ScrollView>
				<View style={{ flexDirection: "row", alignItems: "center", marginTop: 5, justifyContent: "center" }}>
					<Text style={{ color: "#293551", fontFamily: "Raleway-Bold", marginRight: 5, marginVertical: 10 }}>Servicio aceptado</Text>
					<Image source={require("../../../assets/iconos/acepted.png")} style={{ width: 15, height: 15 }} />
				</View>
				<Button title="CALIFICAR CLIENTE"
					buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
					containerStyle={{ marginHorizontal: 25, marginVertical: 20, display: (service["evaluated"] ? "none" : "flex") }}
					onPress={() => this.calificarCliente()}
				/>
			</ScrollView>
		)
	}
}