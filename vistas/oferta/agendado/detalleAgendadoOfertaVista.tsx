import React, { Component } from 'react';
import { View, ScrollView, AsyncStorage, TouchableOpacity, Image, Text } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import Cliente from "../../../componentes/clienteVista";
import Modal from "react-native-modal";
import CancelarOferta from "../../../componentes/cancelarServicioVista";
import ReportarProblema from "../../../componentes/problemaVista";
import AlertModal from "../../../componentes/alertView";
import { general, info, detalle } from "../../../style/request";
import { Notifications } from 'expo';
import { url } from "../../../componentes/config";
export default class DetallesAgendadoOfertaVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, customer: {}, service: {}, fecha_agendada: "", fecha_actual: "", isCancelVisible: false, isProblemVisible: false, user: {} } }
	componentDidMount() {
		AsyncStorage.getItem("@USER").then((user) => { user = JSON.parse(user); this.getOffert(user); })
	}
	verDetalle = () => { this.props["navigation"].navigate("Solicitud", { request: this.props["navigation"].getParam("item").request, phoneE: this.state["user"]["phone"], phoneC: this.state["customer"]["phone"] }); }
	editarOferta = () => {
		return fetch(url + 'fixperto/getOffert', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ expert: this.state["user"]["typeId"], request: this.props["navigation"].getParam("item").request })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				this.props["navigation"].navigate("RealizarOferta", {
					offert: responseJson.offert, action: "mod",
					expert: this.state["user"]["typeId"], request: this.props["navigation"].getParam("item").request,
					solicitud: responseJson.solicitud
				});
			}
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	servicioCompletado = () => {
		return fetch(url + 'fixperto/completedOffert', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({
				id: this.props["navigation"].getParam("item").id,
				request: this.props["navigation"].getParam("item").request
			})
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				Notifications.presentLocalNotificationAsync({
					title: "Servicio completado", body: "Hola, has finalizado el servicio, califica a tu  cliente y gana un fixcoin",
					ios: { sound: true }, android: { channelId: 'fixperto' },
					data: {
						title: 'Servicio completado', texto: "Hola, has finalizado el servicio, califica a tu  cliente y gana un fixcoin", tipo: "experto",
						fecha: "", vista: "Calificar",
						vista_data: { type: "experto", calificador: this.props["navigation"].getParam("item").id, calificado: this.state["customer"] }
					},
				});
				this.props["navigation"].navigate("Completados");
			}
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	cancelarOferta = () => { this.setState({ isCancelVisible: true }); }
	closeCancelarOferta = (correct) => { this.setState({ isCancelVisible: false }); if (correct) this.props["navigation"].navigate("Agendados"); }
	reportarProblema = () => { this.setState({ isProblemVisible: true }); }
	closeReportarProblema = () => { this.setState({ isProblemVisible: false }); }
	getOffert = (user) => {
		return fetch(url + 'fixperto/getOffertScheduled', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id: this.props["navigation"].getParam("item").id })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				if (responseJson.service["hour"] && responseJson.service["start_date"]) {
					var aux = responseJson.service["hour"].split(":"); var from1 = responseJson.service["start_date"].split("/");
					var fecha_agendada = new Date(from1[2], from1[1] - 1, from1[0]);
					fecha_agendada.setDate(fecha_agendada.getDate() - 1);
					fecha_agendada.setHours(aux[0]); fecha_agendada.setMinutes(aux[1]); fecha_agendada.setSeconds(aux[2]);
					var fecha_actual = new Date(responseJson.service["date"]);
					this.setState({ service: responseJson.service, customer: responseJson.customer, fecha_agendada, fecha_actual, user });
				} else { this.setState({ service: responseJson.service, customer: responseJson.customer, user }); }
			}
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	goChat = () => {
		this.props["navigation"].navigate("Chat", {
			chat: { to: this.state["customer"], user: this.state["user"], request: this.props["navigation"].getParam("item").request, type: "experto", action: "mod" }
		})
	}
	render() {
		const { service, customer, fecha_actual, fecha_agendada } = this.state;
		return (
			<ScrollView style={[general.cont3]}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
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
								<Text style={[detalle.text_detalle]}>Fecha de solicitud del servicio. : {service["registry_date"]}</Text>
							</View>
							<View style={[general.cont4]}>
								<Image source={require("../../../assets/iconos/calendar.png")} style={[detalle.img_detalle]} />
								<Text style={[detalle.text_detalle]}>Fecha del servicio: {(service["start_date"]) ? service["start_date"] : "Pendiente"} </Text>
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
					<Cliente cliente={customer} navigation={this.props["navigation"]} />
					<View style={{ flexDirection: "row" }}>
						<Button containerStyle={{ flex: 0.5 }}
							buttonStyle={[detalle.button_chat]}
							icon={<Image source={require("../../../assets/iconos/mensaje.png")} style={detalle.button_chat_icon} />}
							title="CHAT"
							titleStyle={[detalle.button_chat_text]}
							onPress={() => this.goChat()}
						/>
						<Button containerStyle={{ flex: 0.5 }}
							buttonStyle={{ backgroundColor: "#49B0CD", marginTop: 10 }}
							title="EDITAR SERVICIO"
							titleStyle={{ color: "#FFFFFF", fontSize: 14 }}
							onPress={() => { this.editarOferta() }}
						/>
					</View>
				</ScrollView>
				<View style={{ flexDirection: "row", alignItems: "center", marginTop: 5, justifyContent: "center" }}>
					<Text style={{ color: "#293551", fontFamily: "Raleway-Bold", marginRight: 5, marginVertical: 10 }}>Servicio aceptado</Text>
					<Image source={require("../../../assets/iconos/acepted.png")} style={{ width: 18, height: 18, marginTop: 5 }} />
				</View>
				<Button title="SERVICIO FINALIZADO"
					buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
					containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
					onPress={() => this.servicioCompletado()}
				/>
				<Modal isVisible={this.state["isCancelVisible"]} style={{ margin: 5, padding: 0 }}>
					<View style={{ flex: 1, marginHorizontal: 10, marginVertical: 10, backgroundColor: "#FFFFFF" }}>
						<CancelarOferta close={this.closeCancelarOferta} id={this.props["navigation"].getParam("item").id}
							request={this.props["navigation"].getParam("item").request} user={this.state["user"]} />
					</View>
				</Modal >
				<Button type="outline" title="CANCELAR SERVICIO"
					buttonStyle={{ borderColor: "#CE4343", borderRadius: 5, borderWidth: 2 }}
					titleStyle={{ color: "#CE4343", fontFamily: "Raleway-Bold", }}
					containerStyle={{ marginHorizontal: 25, display: (fecha_actual !== "" && fecha_agendada !== "") ? (fecha_actual.getTime() < fecha_agendada.getTime()) ? "flex" : "none" : "flex" }}
					onPress={() => this.cancelarOferta()}
				/>
				<Modal isVisible={this.state["isProblemVisible"]} style={{ margin: 5, padding: 0 }}>
					<View style={{ flex: 1, marginHorizontal: 10, marginVertical: 10, backgroundColor: "#FFFFFF" }}>
						<ReportarProblema close={this.closeReportarProblema} request={this.props["navigation"].getParam("item").request} user={this.state["user"]} />
					</View>
				</Modal >
				<Button type="outline" title="REPORTAR PROBLEMA"
					buttonStyle={{ borderColor: "#43AECC", borderRadius: 7 }}
					titleStyle={{ color: "#43AECC", fontFamily: "Raleway-Bold", }}
					containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
					onPress={() => this.reportarProblema()}
				/>
			</ScrollView>
		)
	}
}