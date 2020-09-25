import React, { Component } from 'react';
import { View, ScrollView, Image, AsyncStorage, TouchableOpacity, Text } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import Experto from "../../../../componentes/expertoVista";
import Modal from "react-native-modal";
import CancelarSolicitud from "../../../../componentes/cancelarSolicitudVista";
import AlertModal from "../../../../componentes/alertView";
import { general, info, detalle } from "../../../../style/request";
import { url } from "../../../../componentes/config";
export default class DetallesProgresoSolicitudVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, experts: [], request: {}, isCancelVisible: false, user: {} } }
	componentDidMount() {
		AsyncStorage.getItem("@USER").then((user) => { user = JSON.parse(user); this.getRequest(user); })
	}
	verDetalle() { this.props["navigation"].navigate("Solicitud", { request: this.state["request"]["id"] }); }
	getRequest = (user) => {
		return fetch(url + 'cliente/getRequestProgress', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id: this.props["navigation"].getParam("id") })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.setState({ request: responseJson.request, experts: responseJson.experts, user }); }
		}).catch((error) => {
			if (error.message === 'Timeout' || error.message === 'Network request failed') {
				this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
			}
		})
	}
	cancelRequest = () => { this.setState({ isCancelVisible: true }); }
	closeCancelarSolicitud = (correct) => { this.setState({ isCancelVisible: false }); if (correct) this.props["navigation"].navigate("Progresos"); }
	render() {
		const { request, experts } = this.state;
		return (
			<ScrollView style={[general.cont3]}>
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
							<TouchableOpacity style={[general.cont4]}
								onPress={() => { this.verDetalle() }} >
								<Image source={require("../../../../assets/iconos/mas.png")} style={[info.img_ver_mas]} />
								<Text style={info.ver_mas}>Ver detalle</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View style={[detalle.container_divider]}>
					<Divider style={[detalle.line_divider]} />
					<Text style={[detalle.text_divider]}>FIXPERTOS POSTULADOS</Text>
					<Divider style={[detalle.line_divider]} />
				</View>
				<ScrollView>
					{experts.map((experto, i) => (
						<View key={i} style={[detalle.cont_contratado, detalle.border_postulado]}>
							<Experto experto={experto} navigation={this.props["navigation"]} />
							{(experto["offert"]) ?
								<View style={{ flexDirection: "row" }}>
									<Button containerStyle={{ flex: 0.5 }}
										buttonStyle={[detalle.button_chat]}
										icon={<Image source={require("../../../../assets/iconos/mensaje.png")} style={detalle.button_chat_icon} />}
										title="Chat"
										titleStyle={[detalle.button_chat_text]}
										onPress={() =>
											this.props["navigation"].navigate("Chat", {
												chat: { to: experto, user: this.state["user"], request: request["id"], type: "cliente", offert: true, typeOffert: "progress" }
											})
										}
									/>
									<Button containerStyle={{ flex: 0.5 }}
										buttonStyle={{ backgroundColor: "#49B0CD", borderRadius: 0, marginTop: 11 }}
										title="VER SERVICIO"
										titleStyle={{ color: "#FFFFFF", fontSize: 14 }}
										onPress={() =>
											this.props["navigation"].navigate("VerOferta", {
												expert: experto["id"], request: request["id"], type: "progress"
											})
										}
									/>
								</View>
								: <Button
									buttonStyle={[detalle.button_chat]}
									icon={<Image source={require("../../../../assets/iconos/mensaje.png")} style={detalle.button_chat_icon} />}
									title="Iniciar conversación"
									titleStyle={[detalle.button_chat_text]}
									onPress={() =>
										this.props["navigation"].navigate("Chat", {
											chat: { to: experto, user: this.state["user"], request: request["id"], type: "cliente", offert: false }
										})
									}
								/>}
						</View>
					))}
				</ScrollView>
				<Modal isVisible={this.state["isCancelVisible"]} style={{ margin: 5, padding: 0 }}>
					<View style={{ flex: 1, marginHorizontal: 10, marginVertical: 10, backgroundColor: "#FFFFFF" }}>
						<CancelarSolicitud close={this.closeCancelarSolicitud} request={this.state["request"].id} />
					</View>
				</Modal >
				<Button type="outline" title="CANCELAR SOLICITUD"
					buttonStyle={{ borderColor: "#CE4343", borderRadius: 5, borderWidth: 2, marginBottom: 20 }}
					titleStyle={{ fontFamily: "Raleway-Bold", color: "#CE4343" }}
					containerStyle={{ marginHorizontal: 25, marginTop: 20 }}
					onPress={() => { this.cancelRequest() }}
				/>
			</ScrollView>
		)
	}
}