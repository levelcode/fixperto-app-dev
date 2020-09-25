import React, { Component } from 'react';
import { View, ScrollView, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { Text, Button, Divider } from 'react-native-elements';
import Cliente from "../../../componentes/clienteVista";
import Modal from "react-native-modal";
import CancelarOferta from "../../../componentes/cancelarServicioVista";
import AlertModal from "../../../componentes/alertView";
import { general, info, detalle } from "../../../style/request";
import { url } from "../../../componentes/config";
export default class DetallesProgresoOfertaVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, customer: {}, service: {}, isCancelVisible: false, user: {} } }
	componentDidMount() { AsyncStorage.getItem("@USER").then((user) => { user = JSON.parse(user); this.getOffert(user); }) }
	verDetalle = () => { this.props["navigation"].navigate("Solicitud", { request: this.props["navigation"].getParam("request") }); }
	editarOferta = () => {
		return fetch(url + 'fixperto/getOffert', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ expert: this.state["user"]["typeId"], request: this.props["navigation"].getParam("request") })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				this.props["navigation"].navigate("RealizarOferta", {
					offert: responseJson.offert, action: "mod",
					expert: this.state["user"]["typeId"], request: this.props["navigation"].getParam("request"),
					solicitud: responseJson.solicitud
				});
			}
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		}).catch((error) => {
			if (error.message === 'Timeout' || error.message === 'Network request failed') {
				this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
			}
		})
	}
	cancelarOferta = () => { this.setState({ isCancelVisible: true }); }
	closeCancelarOferta = (correct) => { this.setState({ isCancelVisible: false }); if (correct) this.props["navigation"].navigate("Progresos"); }
	getOffert = (user) => {
		return fetch(url + 'fixperto/getOffertProgress', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id: this.props["navigation"].getParam("id") })
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
				<View style={[general.cont, detalle.cont_detalle,]}>
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
								<Text style={[detalle.text_detalle]}>{service["registry_date"]}</Text>
							</View>
							<TouchableOpacity style={[general.cont2, general.cont4]}
								onPress={() => this.verDetalle()}>
								<Image source={require("../../../assets/iconos/mas.png")} style={[info.img_ver_mas]} />
								<Text style={info.ver_mas}>Ver más</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View style={[detalle.container_divider]}>
					<Divider style={[detalle.line_divider]} />
					<Text style={[detalle.text_divider]}>CLIENTE</Text>
					<Divider style={[detalle.line_divider]} />
				</View>
				<ScrollView>
					<View style={[detalle.cont_contratado]}>
						<Cliente cliente={customer} navigation={this.props["navigation"]} />
						<View style={{ flexDirection: "row" }}>
							<Button containerStyle={{ flex: 1 }}
								buttonStyle={[detalle.button_chat]}
								icon={<Image source={require("../../../assets/iconos/mensaje.png")} style={detalle.button_chat_icon} />}
								title="Chat"
								titleStyle={[detalle.button_chat_text]}
								onPress={() => {
									this.props["navigation"].navigate("Chat", {
										chat: { to: customer, user: this.state["user"], request: this.props["navigation"].getParam("request"), type: "experto", action: "mod" }
									})
								}}
							/>
						</View>
					</View>
					<View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10, justifyContent: "center" }}>
						<Text style={{ color: "#293551", fontFamily: "Raleway-Bold", marginRight: 5, fontSize: 17 }}>Servicio propuesto</Text>
						<Image source={require("../../../assets/iconos/acepted.png")} style={{ width: 17, height: 17, }} />
					</View>
					<Button
						title="EDITAR SERVICIO"
						buttonStyle={{ backgroundColor: "#49B0CD", borderRadius: 5, marginHorizontal: 20 }}
						titleStyle={{ color: "#FFFFFF", fontSize: 14 }}
						onPress={() => this.editarOferta()}
					/>
					<Modal isVisible={this.state["isCancelVisible"]} style={{ margin: 5, padding: 0 }}>
						<View style={{ flex: 1, marginHorizontal: 10, marginVertical: 10, backgroundColor: "#FFFFFF" }}>
							<CancelarOferta close={this.closeCancelarOferta} id={this.props["navigation"].getParam("id")}
								request={this.props["navigation"].getParam("request")} user={this.state["user"]} />
						</View>
					</Modal >
					<Button type="outline" title="CANCELAR SERVICIO"
						buttonStyle={{ borderColor: "#CE4343", borderRadius: 5, marginTop: 10, borderWidth: 2, marginHorizontal: 20 }}
						titleStyle={{ color: "#CE4343", fontFamily: "Raleway-Bold", }}
						onPress={() => this.cancelarOferta()}
					/>
				</ScrollView>
			</ScrollView>
		)
	}
}