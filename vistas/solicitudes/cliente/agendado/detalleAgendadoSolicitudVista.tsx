import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, AsyncStorage, Text } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import Experto from "../../../../componentes/expertoVista";
import Copy from "../../../../componentes/copyVista";
import Modal from "react-native-modal";
import CancelarSolicitud from "../../../../componentes/cancelarSolicitudVista";
import ReportarProblema from "../../../../componentes/problemaVista";
import AlertModal from "../../../../componentes/alertView";
import { general, info, detalle } from "../../../../style/request";
import { url } from "../../../../componentes/config";
export default class DetallesAgendadoSolicitudVista extends Component {
	constructor(props) {
		super(props); this.state = {
			textoAlert: "", showAlert: false, request: {}, fecha_agendada: "", fecha_actual: "",
			expert: {}, isCancelVisible: false, isProblemVisible: false, user: {}
		}
	}
	componentDidMount() { AsyncStorage.getItem("@USER").then((user) => { user = JSON.parse(user); this.getRequestScheduled(user); }) }
	getRequestScheduled = (user) => {
		return fetch(url + 'cliente/getRequestScheduled', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id: this.props["navigation"].getParam("id") })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				if (responseJson.request["hour"] && responseJson.request["scheduled_date"]) {
					var aux = responseJson.request["hour"].split(":"); var from1 = responseJson.request["scheduled_date"].split("/");
					var fecha_agendada = new Date(from1[2], from1[1] - 1, from1[0]);
					fecha_agendada.setDate(fecha_agendada.getDate() - 1);
					fecha_agendada.setHours(aux[0]); fecha_agendada.setMinutes(aux[1]); fecha_agendada.setSeconds(aux[2]);
					var fecha_actual = new Date(responseJson.request["date"]);
					this.setState({ request: responseJson.request, expert: responseJson.expert, fecha_agendada, fecha_actual, user });
				} else { this.setState({ request: responseJson.request, expert: responseJson.expert, user }); }
			}
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	verDetalle() { this.props["navigation"].navigate("Solicitud", { request: this.props["navigation"].getParam("id"), phoneE: this.state["expert"]["phone"], phoneC: this.state["user"]["phone"] }); }
	rechazar = () => {
		return fetch(url + 'cliente/refuseOffert', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ expert: this.state["expert"].id, request: this.state["request"].id })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.props["navigation"].navigate("Progresos"); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	cancelRequest = () => { this.setState({ isCancelVisible: true }); }
	closeCancelarSolicitud = (correct) => { this.setState({ isCancelVisible: false }); if (correct) this.props["navigation"].navigate("Agendados"); }
	reportarProblema = () => { this.setState({ isProblemVisible: true }); }
	closeReportarProblema = () => { this.setState({ isProblemVisible: false }); }
	render() {
		const { request, expert, fecha_actual, fecha_agendada } = this.state;
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
							<View style={[general.cont4]}>
								<Image source={require("../../../../assets/iconos/calendar.png")} style={[detalle.img_detalle]} />
								<Text style={[detalle.text_detalle]}>Fecha del servicio: {(request["scheduled_date"]) ? request["scheduled_date"] : "Pendiente"}</Text>
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
				<View style={[detalle.cont_contratado, detalle.border_postulado]}>
					<Experto experto={expert} navigation={this.props["navigation"]} />
					<Button
						buttonStyle={[detalle.button_chat]}
						icon={<Image source={require("../../../../assets/iconos/mensaje.png")} style={detalle.button_chat_icon} />}
						title="Chat"
						titleStyle={[detalle.button_chat_text]}
						onPress={() => {
							this.props["navigation"].navigate("Chat", {
								chat: { to: expert, user: this.state["user"], request: request["id"], type: "cliente", offert: true }
							})
						}}
					/>
				</View>
				<Copy texto="Recuerda que todos los servicios solo se pueden cancelar hasta 24 horas antes" />
				<View style={[detalle.cont_detalle]}>
					<Text style={[detalle.servicio_text]}>Servicio aceptado</Text>
					<View style={{ flexDirection: "row", marginHorizontal: 20 }}>
						<Button containerStyle={{ flex: 0.5 }}
							buttonStyle={{ backgroundColor: "#49B0CD", borderRadius: 0 }}
							title="VER SERVICIO" titleStyle={{ color: "#FFFFFF", fontSize: 14 }}
							onPress={() => {
								this.props["navigation"].navigate("VerOferta", {
									expert: expert["id"], request: request["id"], type: "accepted"
								})
							}}
						/>
						<Button containerStyle={{ flex: 0.5 }}
							disabled={(fecha_actual !== "" && fecha_agendada !== "") ? (fecha_actual.getTime() < fecha_agendada.getTime()) ? false : true : false}
							buttonStyle={{ backgroundColor: "#CE4343", borderRadius: 0 }}
							title="RECHAZAR" titleStyle={{ color: "#FFFFFF", fontSize: 14 }}
							onPress={() => { this.rechazar() }}
						/>
					</View>
				</View>
				<Modal isVisible={this.state["isCancelVisible"]} style={{ margin: 5, padding: 0 }}>
					<View style={{ flex: 1, marginHorizontal: 10, marginVertical: 10, backgroundColor: "#FFFFFF" }}>
						<CancelarSolicitud close={this.closeCancelarSolicitud} request={this.state["request"].id} />
					</View>
				</Modal >
				<Button type="outline" title="CANCELAR SOLICITUD"
					buttonStyle={{ borderColor: "#CE4343", borderRadius: 5, borderWidth: 2 }}
					titleStyle={{ fontFamily: "Raleway-Bold", color: "#CE4343" }}
					containerStyle={{ marginHorizontal: 25, marginTop: 20, display: (fecha_actual !== "" && fecha_agendada !== "") ? (fecha_actual.getTime() < fecha_agendada.getTime()) ? "flex" : "none" : "flex" }}
					onPress={() => { this.cancelRequest() }}
				/>
				<Modal isVisible={this.state["isProblemVisible"]} style={{ margin: 5, padding: 0 }}>
					<View style={{ flex: 1, marginHorizontal: 10, marginVertical: 10, backgroundColor: "#FFFFFF" }}>
						<ReportarProblema close={this.closeReportarProblema} request={this.state["request"].id} user={this.state["user"]} />
					</View>
				</Modal >
				<Button type="outline" title="REPORTAR PROBLEMA"
					icon={<Image source={require("../../../../assets/iconos/alert.png")}
						style={{ width: 15, height: 15, marginRight: 10 }} />}
					buttonStyle={{ borderColor: "#43AECC", borderRadius: 5, borderWidth: 2, marginBottom: 30 }}
					titleStyle={{ color: "#43AECC" }}
					containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
					onPress={() => this.reportarProblema()}
				/>
			</ScrollView>
		)
	}
}