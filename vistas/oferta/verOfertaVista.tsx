import React, { Component } from 'react';
import { View, ScrollView, AsyncStorage, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, CheckBox } from 'react-native-elements';
import Modal from "react-native-modal";
import AlertModal from "../../componentes/alertView";
import Copy from "../../componentes/copyVista";
import { general, modal } from "../../style/request";
import { url } from "../../componentes/config";
export default class VerOfertaVista extends Component {
	constructor(props) {
		super(props);
		this.state = { textoAlert: "", showAlert: false, isModalVisible: false, solicitud: { emergency: 0 }, offert: { collaborator: "", col_name: "", col_photo: "", observations: "", cost: "", start_date: "", hour: "", end_date: "", status: "" } }
	}
	componentDidMount() {
		AsyncStorage.getItem("@OFFERTRANQ").then((isModalVisible) => { isModalVisible = JSON.parse(isModalVisible).value; this.getOffert(isModalVisible); })
	}
	getOffert = (isModalVisible) => {
		return fetch(url + 'fixperto/getOffert', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ expert: this.props["navigation"].getParam("expert"), request: this.props["navigation"].getParam("request") })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.setState({ isModalVisible, offert: responseJson.offert, solicitud: responseJson.solicitud }); }
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	toggleModal = () => { this.setState({ isModalVisible: !this.state["isModalVisible"] }); }
	aceptar = () => {
		this.props["navigation"].navigate("Direccion", { expert: this.props["navigation"].getParam("expert"), request: this.props["navigation"].getParam("request"), collaborator: this.state["offert"]["collaborator"] });
	}
	rechazar = () => {
		return fetch(url + 'cliente/refuseOffert', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ expert: this.props["navigation"].getParam("expert"), request: this.props["navigation"].getParam("request") })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.props["navigation"].goBack(); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	verSolicitud = () => { this.props["navigation"].navigate("Solicitud", { request: this.props["navigation"].getParam("request") }); }
	formato = fecha => { if (fecha) { let hora = fecha.split(":"); return hora[0] + "h " + hora[1] + " min"; } else return ""; }
	render() {
		return (
			<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<Modal isVisible={this.state["isModalVisible"]}>
					<View style={{ flex: 1, marginHorizontal: 10, marginVertical: 35 }}>
						<View style={{ flex: 1, padding: 20, backgroundColor: "white", borderRadius: 7 }}>
							<ScrollView>
								<View style={{ flexDirection: "row" }}>
									<View style={{ flex: 0.9, marginStart: 10, marginTop: 10 }}>
										<Text style={{ fontFamily: "Raleway-Bold", color: "#26315F", fontSize: 18, textAlign: "center" }}>Para tu tranquilidad</Text>
									</View>
									<View style={{ flexDirection: "row-reverse" }}>
										<Ionicons name="ios-close" size={40} color="#42AECB" onPress={this.toggleModal} />
									</View>
								</View>
								<View style={[modal.cont_item]}>
									<Image source={require("../../assets/iconos/correct.png")}
										style={{ width: 15, height: 15, marginRight: 5, marginTop: 5 }} />
									<Text style={[modal.cont_item_text]}>ﬁxperto<Text style={{ fontWeight: "bold" }}> valida datos personales</Text> (foto, cédula y antescedentes judiciales)</Text>
								</View>
								<View style={{ flexDirection: "row", marginBottom: 10, marginHorizontal: 10 }}>
									<Image source={require("../../assets/iconos/correct.png")}
										style={{ width: 15, height: 15, marginRight: 5, marginTop: 5 }} />
									<Text style={[modal.cont_item_text]}>Si el servicio se agenda 100% por la plataforma, <Text style={{ fontWeight: "bold" }}>ﬁxperto acompaña el proceso con asesoramiento</Text>  de servicio al cliente, notificaciones de recordatorio o sustitución del experto si es necesario.</Text>
								</View>
								<View style={{ flexDirection: "row", marginBottom: 10, marginHorizontal: 10 }}>
									<Image source={require("../../assets/iconos/correct.png")}
										style={{ width: 15, height: 15, marginRight: 5, marginTop: 5 }} />
									<Text style={[modal.cont_item_text]}>Como empresa tenemos un compromiso con el país, y nuestro enfoque es el avance socioeconómico de nuestros fixpertos; y ser la solución en calidad y experiencia para nuestros usuarios. Juntos podemos lograrlo.</Text>
								</View>
								<View style={{ flexDirection: "row", marginBottom: 10, marginHorizontal: 10 }}>
									<Image source={require("../../assets/iconos/correct.png")}
										style={{ width: 15, height: 15, marginRight: 5, marginTop: 5 }} />
									<Text style={[modal.cont_item_text]}>Gracias al sistema de calificación podemos ver la experiencia y valoración que han compartido otros usuarios con dicho experto.</Text>
								</View>
								<CheckBox
									containerStyle={{ borderWidth: 0, backgroundColor: "#FFFFFF" }}
									center
									title={<Text style={[modal.text_checkbox, { fontWeight: "bold" }]}>No volver a mostrar este mensaje</Text>}
									checked={!this.state["isModalVisible"]}
									checkedColor="#48B0CB"
									onPress={() => { this.setState({ isModalVisible: !this.state["isModalVisible"] }); AsyncStorage.setItem("@OFFERTRANQ", JSON.stringify({ value: false })); }}
								/>
							</ScrollView>
						</View>
					</View>
				</Modal>
				<View style={{ marginHorizontal: 20, marginBottom: 15 }}>
					<Button containerStyle={{ marginVertical: 20 }} type="outline"
						buttonStyle={{ borderColor: "#42AECB", borderRadius: 7, borderWidth: 1 }}
						titleStyle={{ color: "#42AECB" }} title="VER SOLICITUD"
						icon={
							<Image source={require("../../assets/iconos/solicit.png")}
								style={{ width: 25, height: 25, marginRight: 10, marginLeft: 0 }} />
						}
						onPress={() => this.verSolicitud()}
					/>
				</View>
				<View style={{ display: (this.state["solicitud"]["emergency"] === 1) ? "flex" : "none", marginHorizontal: 20 }}>

					<View style={{ flexDirection: "row", marginVertical: 5, }}>
						<Image source={require("../../assets/iconos/emergencia.png")} style={{ width: 15, height: 15 }} />
						<Text style={{ marginRight: 5, fontFamily: "Raleway-Bold", fontSize: 15, marginStart: 5, color: "#293763" }}>Servicio de emergencia</Text>
					</View>
					<Text style={{ color: "#293763", fontFamily: "Raleway-Bold", marginBottom: 5, fontSize: 15 }}>Tiempo de respuesta: {this.formato(this.state["offert"]["response_time"])}</Text>
				</View>

				{(this.state["offert"]["status"] === "progress") && <View style={{ marginHorizontal: 20 }}>
					<Copy texto="Antes de aceptar el servicio le recomendamos que su experto ingrese toda la información de la propuesta" />
				</View>}


				<Text style={{ fontFamily: "Raleway-Bold", marginTop: 20, fontSize: 15, marginVertical: 10, marginHorizontal: 20 }}>Propuesta del servcio</Text>

				<View style={{ marginHorizontal: 20, borderWidth: 1, borderColor: "silver", padding: 5, borderRadius: 7, minHeight: 75 }}>
					<Text style={{ marginBottom: 10 }}>{this.state["offert"]["observations"]}</Text>
					<View style={{ flexDirection: "row", marginBottom: 5 }}>
						<Text style={{ fontFamily: "Raleway-Bold", fontSize: 15, color: "#273861" }}>Fecha: </Text>
						<Text>{(this.state["offert"]["start_date"]) ? this.state["offert"]["start_date"] : "Pendiente"}</Text>
					</View>
					<View style={{ flexDirection: "row" }}>
						<Text style={{ fontFamily: "Raleway-Bold", fontSize: 15, color: "#273861" }}>Hora: </Text>
						<Text>{(this.state["offert"]["hour"]) ? this.state["offert"]["hour"] : "Pendiente"}</Text>
					</View>
				</View>


				{
					this.state["offert"]["collaborator"] !== null && <View style={{ marginHorizontal: 20 }}>

						<Text style={{ fontFamily: "Raleway-Bold", marginVertical: 15, fontSize: 15 }}>Persona que realizará el trabajo:</Text>

						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<View style={{ flex: 0.3, alignItems: "center" }}>
								<Image source={{ uri: url + "uploads/registros/empresa/collaborators/" + this.state["offert"]["col_photo"] }} style={{ width: 70, height: 70, borderRadius: 5 }} />
							</View>


							<View style={{ flex: 0.9, marginLeft: 5 }}>

								<Text style={{ fontFamily: "Raleway-Bold", fontSize: 18, color: "#273861", marginVertical: 5 }}>{this.state["offert"]["col_name"]}</Text>

								<View style={{ flexDirection: "row", marginVertical: 5 }}>
									<Text style={{ fontFamily: "Raleway-Bold", fontSize: 15, color: "#6a6b6d" }}>Cédula: </Text>
									<Text style={{ fontSize: 15 }}>{this.state["offert"]["col_number"]}</Text>
								</View>

								<View style={{ flexDirection: "row" }}>
									<Text style={{ fontFamily: "Raleway-Bold", fontSize: 15, color: "#6a6b6d" }}>Teléfono: </Text>

									<Text style={{ fontSize: 15 }}>{this.state["offert"]["col_phone"]}</Text>
								</View>
							</View>
						</View>

					</View>

				}
				{
					this.state["offert"]["status"] === "progress" && <View>
						<Button title="ACEPTAR SERVICIO"
							buttonStyle={{ backgroundColor: "#42AECB", borderRadius: 7 }}
							type="solid" containerStyle={{ marginHorizontal: 25, marginTop: 20 }}
							onPress={() => this.aceptar()}
						/>
						<Button containerStyle={{ marginHorizontal: 25, marginVertical: 20 }} type="outline"
							buttonStyle={{ borderColor: "#CE4343", borderRadius: 7, borderWidth: 2 }}
							titleStyle={{ color: "#CE4343" }} title="RECHAZAR SERVICIO"
							onPress={() => this.rechazar()}
						/>
					</View>
				}
			</ScrollView >
		)
	}
}