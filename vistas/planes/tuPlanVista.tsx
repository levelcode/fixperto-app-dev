import React, { Component } from "react";
import { View, AsyncStorage, ScrollView, Image, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Button, Divider, Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import AlertModal from "../../componentes/alertView";
import { general, info } from "../../style/plan";
import { url } from "../../componentes/config";
export default class TuPlanVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, isModalVisible: false } }
	toggleModal = () => { this.setState({ isModalVisible: !this.state["isModalVisible"] }); }
	cancelarPlan = () => {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			return fetch(url + 'fixperto/cancelPlan', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id: user["planId"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) {
					user["planStatus"] = "cancelled"; AsyncStorage.setItem("@USER", JSON.stringify(user));
					this.props["navigation"].goBack();
				}
			})
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		})
	}
	formatDate = fecha => {
		let arr = fecha.split(" "); let fech = arr[0].split("-");
		//let hors = arr[1].split(":");
		let date = new Date(fech[0], fech[1], fech[2]);
		//let date = new Date(fecha); 
		let day = date.getDate(); let month = date.getMonth(); let year = date.getFullYear();
		let days = ""; let months = "";
		if (day < 10) { days = `0${day}`; } else { days = day.toString(); }
		if (month < 10) { months = `0${month}`; } else { months = month.toString(); }
		return `${days}/${months}/${year}`;
	}
	render() {
		return (
			<ScrollView>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />

				<View style={[general.cont_plan]}>
					<View style={[general.container]}>

						<View style={[general.cont_regalo,]}>
							<Image source={(this.props["navigation"].getParam("planUri") === "regalo") ?
								require("../../assets/iconos/regalo.png") : (this.props["navigation"].getParam("planUri") === "oro") ?
									require("../../assets/iconos/oro.png") :
									require("../../assets/iconos/bronce.png")} style={{ width: 80, height: 80 }} />
						</View>

						<View style={[general.bienvenida]}>
							<Text style={{ fontSize: 20, marginVertical: 5, fontFamily: "Raleway-Bold", color: "#273861" }}>
								Plan {(this.props["navigation"].getParam("planUri") === "regalo") ? "bienvenida" : this.props["navigation"].getParam("planUri")}
							</Text>
							{this.props["navigation"].getParam("planPrice") !== 0 && <Text style={{ color: "#42AECC", fontFamily: "Raleway-Bold" }}> $ {this.props["navigation"].getParam("planPrice")}</Text>}
						</View>

					</View>

					<View style={{ backgroundColor: "#D9F4BB", padding: 8 }}>
						<Text style={{ textAlign: "center", }}>Vence el: {this.formatDate(this.props["navigation"].getParam("planEnd"))}</Text>
					</View>
				</View>

				<Divider />

				<TouchableOpacity onPress={() => { this.props["navigation"].navigate("Fixcoins") }}
					style={[info.cont_paquetes]}>
					<Ionicons name="ios-arrow-forward" size={25} color="#46ADCC" style={{ marginHorizontal: 5 }} />
					<Text style={{ fontSize: 15, textAlign: "left", flex: 1 }}>Comprar paquete de fixcoin</Text>
				</TouchableOpacity>

				<Divider />

				<TouchableOpacity onPress={() => { this.props["navigation"].navigate("Planes") }}
					style={[info.cont_paquetes]}>
					<Ionicons name="ios-arrow-forward" size={25} color="#46ADCC" style={{ marginHorizontal: 5 }} />
					<Text style={{ fontSize: 15, textAlign: "left", flex: 1 }}>Seleccionar otro plan</Text>
				</TouchableOpacity>

				<Divider />

				<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
					<Image source={require("../../assets/iconos/tus_datos.png")} style={{ width: 20, height: 20 }} />
					<Text style={{ fontFamily: "Raleway-Bold", marginStart: 5, fontSize: 18, color: "#273861" }}>Beneficios</Text>
				</View>

				{(this.props["navigation"].getParam("planUri") === "regalo") ?
					<View style={{ padding: 15 }}>
						<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
							<Image source={require("../../assets/iconos/fixcoin.png")} style={[info.info_icon]} />
							<Text style={[info.info_text]}>Recibe 20 fixcoin, estos te permitirán hacer servicios</Text>
						</View>
						<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
							<Image source={require("../../assets/iconos/activo.png")} style={[info.info_icon]} />
							<Text style={[info.info_text]}>Activo en plataforma</Text>
						</View>
						<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
							<Image source={require("../../assets/iconos/capacitaciones.png")} style={[info.info_icon]} />
							<Text style={[info.info_text]}>Capacitaciones</Text>
						</View>
					</View>
					: (this.props["navigation"].getParam("planUri") === "oro") ?
						<View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={[info.info_text]}>Estar activo en la plataforma</Text>
							</View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={[info.info_text]}>Capacitaciones</Text>
							</View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={[info.info_text]}>Visibilidad sobre Bronce</Text>
							</View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={[info.info_text]}>Más fixcoin</Text>
							</View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={[info.info_text]}>Sello Premium</Text>
							</View>
						</View> :
						<View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={[info.info_text]}>Estar activo en la plataforma</Text>
							</View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={[info.info_text]}>Capacitaciones</Text>
							</View>
						</View>

				}
				<Modal isVisible={this.state["isModalVisible"]}>
					<View style={{ flex: 1, marginHorizontal: 10, justifyContent: "center", alignItems: "center" }}>
						<View style={{ backgroundColor: "#FFFFFF", borderRadius: 10 }}>
							<View style={{ flexDirection: "row", marginTop: 25, marginHorizontal: 10, alignItems: "center", justifyContent: "center" }}>
								<Image source={require("../../assets/iconos/alert.png")} style={{ width: 30, height: 30 }} />
								<Text style={{ marginStart: 10, fontSize: 15, fontFamily: "Raleway-Bold", color: "#283B64" }}>Recuerda que al cancelar tu plan</Text>
							</View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={{ marginStart: 10, fontSize: 15 }}>No recibirás solicitudes</Text>
							</View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={{ marginStart: 10, fontSize: 15 }}>No podrás realizar servicios</Text>
							</View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={{ marginStart: 10, fontSize: 15 }}>Se mantiene tu saldo en fixcoin que podrás recuperar al comprar un plan</Text>
							</View>
							<Button title="CANCELAR PLAN"
								buttonStyle={{ borderColor: "#49B0CD", borderRadius: 7 }}
								titleStyle={{ fontFamily: "Raleway-Bold", color: "#FFFFFF" }}
								containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
								onPress={() => { this.toggleModal(); this.cancelarPlan() }}
							/>
							<Button type="outline" title="VOLVER"
								buttonStyle={{ borderColor: "#49B0CD", borderRadius: 7 }}
								titleStyle={{ fontFamily: "Raleway-Bold", color: "#49B0CD" }}
								containerStyle={{ marginHorizontal: 25, marginBottom: 20 }}
								onPress={() => { this.toggleModal() }}
							/>
						</View>
					</View>
				</Modal>
				<Button title="CANCELAR PLAN" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
					titleStyle={{ fontFamily: "Raleway-Bold" }}
					containerStyle={{ marginHorizontal: 20, marginTop: 40 }}
					onPress={() => this.toggleModal()}
				/>
			</ScrollView>
		)
	}
}