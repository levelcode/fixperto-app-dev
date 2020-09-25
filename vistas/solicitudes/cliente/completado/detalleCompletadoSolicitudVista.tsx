import React, { Component } from 'react';
import { View, ScrollView, Image, AsyncStorage, TouchableOpacity, Text } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import Experto from "../../../../componentes/expertoVista";
import AlertModal from "../../../../componentes/alertView";
import { general, info, detalle } from "../../../../style/request";
import { url } from "../../../../componentes/config";
export default class DetallesCompletadoSolicitudVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, request: {}, expert: {}, user: {} } }
	componentDidMount() { AsyncStorage.getItem("@USER").then((user) => { user = JSON.parse(user); this.getRequestCompleted(user); }) }
	getRequestCompleted = (user) => {
		return fetch(url + 'cliente/getRequestCompleted', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id: this.props["navigation"].getParam("id") })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.setState({ request: responseJson.request, expert: responseJson.expert, user }); }
		}).catch((error) => {
			if (error.message === 'Timeout' || error.message === 'Network request failed') {
				this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
			}
		})
	}
	calificarExperto = () => {
		this.props["navigation"].navigate("Calificar", {
			type: "cliente",
			calificador: this.props["navigation"].getParam("item").id,
			calificado: this.state["expert"]
		})
	}
	verDetalle = () => { this.props["navigation"].navigate("Solicitud", { request: this.props["navigation"].getParam("id") }); }
	render() {
		const { request, expert } = this.state;
		return (
			<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<View style={[general.cont, detalle.cont_detalle]}>
					<View style={{ flex: 0.3, alignItems: "center" }}>
						<View style={[info.cont_img]}>
							{(request.icon) ?
								<Image source={{ uri: request.icon }} style={{ width: 50, height: 50 }} />
								: <Image source={require("../../../../assets/icon.png")} style={{ width: 50, height: 50 }} />
							}
						</View>
					</View>
					<View style={{ flex: 0.9 }}>
						<View style={[info.cont_text]}>
							{
								request["emergency"] === 1 &&
								<View style={{ flexDirection: "row", marginVertical: 5 }}>
									<Image source={require("../../../../assets/iconos/emergencia.png")} style={{ width: 15, height: 15 }} />
									<Text style={{ marginRight: 5, fontFamily: "Raleway-Bold", fontSize: 16, marginStart: 5, color: "#293763" }}>Servicio de emergencia</Text>
								</View>
							}
							<Text style={[info.cont_text_title]}>{request["service"]}
								<Text style={[info.cont_text_title_cat]}>/{request["category"]}</Text>
							</Text>
							<View style={[general.cont4]}>
								<Image source={require("../../../../assets/iconos/ubicacion.png")} style={[detalle.img_detalle]} />
								<Text style={[detalle.text_detalle]}>{request["zone"]}</Text>
							</View>
							<View style={[general.cont4]}>
								<Image source={require("../../../../assets/iconos/calendar.png")} style={[detalle.img_detalle]} />
								<Text style={[detalle.text_detalle]}>Fecha de solicitud del servicio: {request["registry_date"]}</Text>
							</View>
							<View style={[general.cont4]}>
								<Image source={require("../../../../assets/iconos/calendar.png")} style={[detalle.img_detalle]} />
								<Text style={[detalle.text_detalle]}>Fecha completado: {(request["completed_date"]) ? request["completed_date"] : "Pendiente"}</Text>
							</View>
							<TouchableOpacity style={[general.cont2, general.cont4]}
								onPress={() => { this.verDetalle() }} >
								<Image source={require("../../../../assets/iconos/mas.png")} style={[info.img_ver_mas]} />
								<Text style={info.ver_mas}>Ver detalle</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View style={[detalle.container_divider]}>
					<Divider style={[detalle.line_divider]} />
					<Text style={[detalle.text_divider]}>FIXPERTO CONTRATADO</Text>
					<Divider style={[detalle.line_divider]} />
				</View>
				<View style={[detalle.cont_contratado]}>
					<Experto experto={expert} navigation={this.props["navigation"]} />
					<Button
						buttonStyle={[detalle.button_chat]}
						icon={<Image source={require("../../../../assets/iconos/mensaje.png")} style={detalle.button_chat_icon} />}
						title="Ver historial"
						titleStyle={[detalle.button_chat_text]}
						onPress={() => {
							this.props["navigation"].navigate("Chat", {
								chat: { to: expert, user: this.state["user"], request: request["id"], type: "cliente", offert: true }
							})
						}}
					/>
				</View>
				<View style={[detalle.cont_detalle]}>
					<Text style={[detalle.servicio_text]}>Servicio aceptado</Text>
					<Button containerStyle={{ marginHorizontal: 25, marginBottom: 10 }}
						buttonStyle={{ backgroundColor: "#273861", borderRadius: 7, marginBottom: 10 }}
						title="VER SERVICIO"
						onPress={() => {
							this.props["navigation"].navigate("VerOferta", {
								expert: expert["id"], request: request["id"], type: "completed"
							})
						}}
					/>
				</View>
				<Button title="CALIFICAR EXPERTO"
					buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
					containerStyle={{ marginHorizontal: 25, marginVertical: 20, display: (request["evaluated"] ? "none" : "flex") }}
					onPress={() => this.calificarExperto()}
				/>
			</ScrollView>
		)
	}
}