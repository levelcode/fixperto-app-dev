import React, { Component } from 'react';
import { View, ScrollView, Platform, Modal, AsyncStorage, Image, Text, TouchableOpacity } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Dropdown } from 'react-native-material-dropdown';
import { Button, Input, Divider } from 'react-native-elements';
import AlertModal from "../../componentes/alertView";
import Copy from "../../componentes/copyVista";
import { general, info, detalle } from "../../style/request";
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from '@expo/vector-icons';
import { Notifications } from 'expo';
import { url } from "../../componentes/config";
export default class RealizatOfertaVista extends Component {
	constructor(props) {
		super(props);
		this.state = {
			am_pm: "am",
			textoAlert: "", showAlert: false, show_start_date: false, start_date: "", hour: { hor: "00", min: "00" }, response_time: { hor: "00", min: "00" },
			user: {}, collaborators: [], collaborator: 0, modalVisible: false, buttonDisabled: false, id: "", action: "add", description: "",
			request: this.props["navigation"].getParam("solicitud")
		}
	}
	hours = [
		{ value: '00' },
		{ value: '01' },
		{ value: '02' },
		{ value: '03' },
		{ value: '04' },
		{ value: '05' },
		{ value: '06' },
		{ value: '07' },
		{ value: '08' },
		{ value: '09' },
		{ value: '10' },
		{ value: '11' },
		{ value: '12' }
	];
	mins = [
		{ value: '00' },
		{ value: '05' },
		{ value: '10' },
		{ value: '15' },
		{ value: '20' },
		{ value: '25' },
		{ value: '30' },
		{ value: '35' },
		{ value: '40' },
		{ value: '45' },
		{ value: '50' },
		{ value: '55' }
	];
	componentDidMount() {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			let params = this.props["navigation"].state.params;
			if (params["offert"] && (params["action"] === "mod" || params["action"] === "show")) {
				let response_time = { hor: "00", min: "00" };
				if (params["solicitud"].emergency === 1) {
					let hora = params["offert"].response_time.split(":");
					response_time["hor"] = hora[0];
					response_time["min"] = hora[1];
				}
				let hour = { hor: "00", min: "00" };
				let am_pm = "am";
				if (/*params["solicitud"].emergency === 0 &&*/ params["offert"].hour) {
					let hora = params["offert"].hour.split(":");
					if (parseInt(hora[0]) > 12) {
						am_pm = "pm";
						let h = parseInt(hora[0]) - 12;
						if (h.toString().length === 1) hour["hor"] = "0" + h.toString();
						else hour["hor"] = h.toString();
					} else { hour["hor"] = hora[0]; }
					hour["min"] = hora[1];
				}
				this.setState({
					action: params["action"], id: params["offert"].id,
					description: params["offert"].observations,
					start_date: (params["offert"].start_date) ? this.convertDateTimeUpdate(params["offert"].start_date) : "",
					hour,
					am_pm,
					response_time,
					collaborator: params["offert"].collaborator,
					user
				})
			}
			else { this.setState({ user }); }
			if (user["type"] === "empresa") this.getCollaboratorsToService(user["typeId"]);
		});
	}
	getCollaboratorsToService = (id) => {
		if (!(this.state["collaborators"].length > 0)) {
			return fetch(url + 'fixpertoEmpresa/getCollaboratorsToService', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id, request: this.props["navigation"].getParam("request") })
			}).then(response => response.json()).then(responseJson => { this.setState({ collaborators: responseJson.result }); })
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		}
	}
	sendOfert = () => {
		if (this.props["navigation"].state.params["action"] === "mod") {
			if (this.state["start_date"] === "") {
				this.setState({ showAlert: true, textoAlert: "Debe dar una fecha del servicio" });
			}
			else if (this.state["hour"]["hor"] === "" || this.state["hour"]["min"] === "") {
				this.setState({ showAlert: true, textoAlert: "Debe dar una hora del servicio" });
			}
		}
		if (this.state["request"]["emergency"] === 1) {
			if (this.state["response_time"]["hor"] === "" || this.state["response_time"]["min"] === "") {
				this.setState({ showAlert: true, textoAlert: "Debe dar un tiempo de respuesta" });
			}
		}
		/*if (this.state["description"] === "") {
			return this.setState({ showAlert: true, textoAlert: "Debe dar una propuesta del servicio" });
		}*/
		if (this.state["user"]["type"] === "empresa" && this.state["collaborator"] === 0) {
			this.setState({ showAlert: true, textoAlert: "Debe seleccionar un colaborador" });
		}
		else {
			let user = this.state["user"];
			this.setState({ buttonDisabled: true });
			return fetch(url + 'fixperto/sendOffert', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({
					action: this.state["action"],
					collaborator: this.state["collaborator"],
					type: user["type"],
					id: this.state["id"],
					expert: this.props["navigation"].getParam("expert"),
					request: this.props["navigation"].getParam("request"),
					observations: this.state["description"],
					response_time: this.state["response_time"]["hor"].concat(":", this.state["response_time"]["min"]),
					start_date: (this.props["navigation"].state.params["action"] === "mod") ? this.convertDateTime(this.state["start_date"]) : "",
					hour: (this.props["navigation"].state.params["action"] === "mod") ? this.hora() : "",
					cost: this.props["navigation"].getParam("cost"),
				})
			}).then(response => response.json()).then(responseJson => {
				this.setState({ buttonDisabled: false });
				if (responseJson.success) {
					if (this.state["action"] === "add") {
						user["cant_fitcoints"] = user["cant_fitcoints"] - this.props["navigation"].getParam("cost");
						AsyncStorage.setItem("@USER", JSON.stringify(user));
						this.setState({ modalVisible: true });
						setTimeout(() => {
							this.setState({ modalVisible: false }); this.props["navigation"].navigate("Progresos"); /*this.props["navigation"].goBack();*/
						}, 2000);
						Notifications.presentLocalNotificationAsync({
							title: "Servicio enviado", body: "Hola, tu servicio ha sido enviado al cliente",
							data: { withSome: 'data', title: 'Servicio enviado', texto: "Hola, tu servicio ha sido enviado al cliente", fecha: "", tipo: "experto", vista: "Progresos", actualizarFix: true },
							ios: { sound: true },
							android: { channelId: 'fixperto' },
						});
					} else if (this.state["action"] === "mod") { this.setState({ modalVisible: false }); this.props["navigation"].goBack(); }
				}
				else { this.setState({ showAlert: true, textoAlert: "No se ha podido enviar el servicio inténtelo nuevamente" }); }
			}).catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
		}
	}
	keyExtractor = (item, index) => index.toString();
	convertDateTimeUpdate(date) { var from = date.split("/"); return new Date(from[2], from[1] - 1, from[0]); }
	convertHourUpdate(time) {
		var aux = time.split(":");
		var from = new Date(); from.setHours(aux[0]); from.setMinutes(aux[1]); from.setSeconds(aux[2]); return from;
	}
	formatDate = date => {
		let today = new Date(date); return today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();
	}
	convertDateTime = (date) => {
		var fecha = new Date(date); return fecha.toISOString().split('T')[0] + ' ' + fecha.toTimeString().split(' ')[0];
	}
	formatHour = time => {
		let fecha = new Date(time);
		let hora = (fecha.getHours().toString().length === 1) ? "0" + fecha.getHours() : fecha.getHours();
		let minutos = (fecha.getMinutes().toString().length === 1) ? "0" + fecha.getMinutes() : fecha.getMinutes();
		return hora + ":" + minutos + ":00";
	}
	hora = () => {
		if (this.state["am_pm"] === "pm") {
			var h = parseInt(this.state["hour"]["hor"]);
			return (h + 12).toString().concat(":", this.state["hour"]["min"]);
		}
		else { return this.state["hour"]["hor"].concat(":", this.state["hour"]["min"]); }
	}
	render() {
		const { action, request, show_start_date, start_date, hour, response_time, am_pm } = this.state;
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
					<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
					<View style={general.cont3}>
						<View style={[general.cont]}>
							<View style={{ flex: 0.3, alignItems: "center" }}>
								<View style={[info.cont_img]}>
									{(request.icon) ?
										<Image source={{ uri: request.icon }} style={{ width: 60, height: 60, marginTop: 20 }} />
										: <Image source={require("../../assets/icon.png")} style={{ width: 60, height: 60, marginTop: 20 }} />
									}
								</View>
							</View>
							<View style={{ flex: 0.9 }}>
								<View style={[info.cont_text, { padding: 20 }]}>
									{
										request.emergency === 1 &&
										<View style={{ flexDirection: "row", marginVertical: 3 }}>
											<Image source={require("../../assets/iconos/emergencia.png")} style={{ width: 15, height: 15 }} />
											<Text style={{ marginRight: 5, fontFamily: "Raleway-Bold", fontSize: 16, marginStart: 5, color: "#293763" }}>Servicio de emergencia</Text>
										</View>

									}
									<Text style={[info.cont_text_title]}>{request.service}
										<Text style={[info.cont_text_title_cat]}>/{request.category}</Text>
									</Text>
									<Text style={[info.cont_text_title, general.cont4]}>Solicitud del servicio :
										<Text style={[info.cont_text_title_cat]}> {request.registry_date} </Text>
									</Text>
									<Text style={[info.cont_text_title, general.cont4]}>Descripción :
										<Text style={[info.cont_text_title_cat]}> {request.description} </Text>
									</Text>
									<Text style={[info.cont_text_title, general.cont4]}>Ubicación :
										<Text style={[info.cont_text_title_cat]}> {request.zone} </Text>
									</Text>
									<Text style={[info.cont_text_title, general.cont4]}>Dirección :
										<Text style={[info.cont_text_title_cat]}> {(request.address) ? request.address : "Pendiente"} </Text>
									</Text>
								</View>
							</View>
						</View>
					</View>
					<View style={[detalle.container_divider]}>
						<Divider style={[detalle.line_divider]} />
						<Text style={[detalle.text_divider]}>SERVICIO</Text>
						<Divider style={[detalle.line_divider]} />
					</View>
					<Modal transparent visible={this.state["modalVisible"]}>
						<View style={{ backgroundColor: "rgba(0,0,0, 0.5)", flex: 1, flexDirection: "column", justifyContent: "center" }}>
							<View style={{ marginHorizontal: 50, backgroundColor: "#ffffff", borderRadius: 18, padding: 20, paddingTop: 50 }}>
								<View style={{ flexDirection: "column", alignItems: "center", }}>
									<Image source={require("../../assets/iconos/fixcoin.gif")} style={{ width: 100, height: 100 }}></Image>

									<Text style={{ fontSize: 20, color: '#283B64', textAlign: "center", fontFamily: "Raleway-Bold", padding: 8 }}>Se te han descontado </Text>

									<Text style={{ fontSize: 28, color: '#283B64', textAlign: "center", fontFamily: "Raleway-Bold" }} > {this.props["navigation"].getParam("cost")} fixcoin</Text>
								</View>
							</View>
						</View>
					</Modal>
					<View style={{ marginHorizontal: 10, marginBottom: 10, display: (this.props["navigation"].state.params["action"] === "add") ? "none" : "flex" }}>
						<Text style={[{ fontFamily: "Raleway-Bold", marginTop: 15, marginBottom: 5, color: "#273861", fontSize: 17 }]}>Fecha de prestación del servicio *</Text>
						<TouchableOpacity disabled={(this.props["navigation"].state.params["action"] === "show") ? true : false}
							onPress={() => this.setState({ show_start_date: true })}
							style={{ flexDirection: "row", alignItems: "center", borderRadius: 5, borderWidth: 0.5, borderColor: "silver", height: 40 }}>
							<Text style={{ marginLeft: 5 }}>{(start_date !== "") ? this.formatDate(start_date) : ""}</Text>
							<Ionicons name="ios-close-circle" color="#CE4343" size={25} style={{ marginHorizontal: 10, display: (start_date !== "" && this.props["navigation"].state.params["action"] !== "show") ? "flex" : "none" }}
								onPress={() => { this.setState({ start_date: "" }) }}
							/>
						</TouchableOpacity>
						{show_start_date && <View>
							{Platform.OS === "ios" && <Button title="CONTINUAR"
								buttonStyle={{ backgroundColor: "#49B0CD" }}
								titleStyle={{ color: "#FFFFFF", fontSize: 14 }}
								onPress={() => { this.setState({ show_start_date: false }); }}
							/>}
							<DateTimePicker
								testID="dateInicioTimePicker"
								value={start_date || new Date()}
								minimumDate={new Date()}
								onChange={(event, start_date) => {
									if (Platform.OS === "android" && event["type"] === "set") {
										this.setState({ start_date, show_start_date: false });
									}
									else if (Platform.OS === "ios") {
										this.setState({ start_date });
									}
								}}
							/>
						</View>}
						<Text style={[{ fontFamily: "Raleway-Bold", marginTop: 15, marginBottom: 5, color: "#273861", fontSize: 17/*, display: (request.emergency === 1) ? "none" : "flex"*/ }]}> Hora *</Text >
						<View style={{ flexDirection: "row"/*, display: (request.emergency === 1) ? "none" : "flex"*/ }}>
							<View style={{ flex: 0.25 }}>
								<Text style={{ fontFamily: "Raleway-Bold", textAlign: "justify", fontSize: 15, color: "#999797" }}>Horas</Text>
								<Dropdown
									itemTextStyle={{ fontFamily: "Raleway-Regular" }}
									data={this.hours}
									value={hour["hor"]}
									onChangeText={selectedItems => { this.setState(prevState => (prevState["hour"]["hor"] = selectedItems)); }}
								/>
							</View>
							<View style={{ flex: 0.35 }}>
								<Text style={{ fontFamily: "Raleway-Bold", textAlign: "justify", fontSize: 15, color: "#999797", marginLeft: 20 }}>Minutos</Text>
								<Dropdown
									containerStyle={{ marginLeft: 20 }}
									itemTextStyle={{ fontFamily: "Raleway-Regular" }}
									data={this.mins}
									value={hour["min"]}
									onChangeText={(selectedItems) => {
										this.setState(prevState => (prevState["hour"]["min"] = selectedItems))
									}}
								/>
							</View>
							<View style={{ flex: 0.20, justifyContent: "flex-end", marginLeft: 20 }}>
								<Dropdown
									itemTextStyle={{ fontFamily: "Raleway-Regular" }}
									data={[{ value: "am" }, { value: "pm" }]}
									value={am_pm}
									onChangeText={am_pm => { this.setState(prevState => (prevState["am_pm"] = am_pm)); }}
								/>
							</View>
						</View>
					</View >
					<View style={{ marginHorizontal: 10, display: (request.emergency === 1) ? "flex" : "none" }}>
						<Text style={[{ fontFamily: "Raleway-Bold", marginTop: 15, marginBottom: 5, color: "#273861", fontSize: 17 }]}>Tiempo de respuesta *</Text>
						<View style={{ flex: 1, flexDirection: "row", marginTop: 10, paddingHorizontal: 10 }}>
							<View style={{ flex: 0.5 }}>
								<Text style={{ fontFamily: "Raleway-Bold", textAlign: "left", fontSize: 15, color: "#999797" }}>Horas</Text>
								<Dropdown
									itemTextStyle={{ fontFamily: "Raleway-Regular" }}
									data={this.hours}
									value={response_time["hor"]}
									onChangeText={selectedItems => {
										this.setState(prevState => (prevState["response_time"]["hor"] = selectedItems))
									}}
								/>
							</View>
							<View style={{ flex: 0.5 }}>
								<Text style={{ fontFamily: "Raleway-Bold", marginLeft: 10, textAlign: "left", fontSize: 15, color: "#999797" }}>Minutos</Text>
								<Dropdown
									containerStyle={{ marginLeft: 10 }}
									itemTextStyle={{ fontFamily: "Raleway-Regular" }}
									data={this.mins}
									value={response_time["min"]}
									onChangeText={(selectedItems) => {
										this.setState(prevState => (prevState["response_time"]["min"] = selectedItems))
									}}
								/>
							</View>
						</View>
						<Copy texto="Podrás cancelar un servicio hasta un día antes de la hora propuesta" />
					</View>
					<View style={{ marginHorizontal: 10, marginBottom: 15 }}>
						<Text style={{ fontFamily: "Raleway-Bold", marginTop: 10, marginBottom: 5, color: "#273861", fontSize: 17 }}>¿Quieres hacer una propuesta?</Text>
						<Input multiline
							inputContainerStyle={{ paddingLeft: 0, paddingRight: 0, marginBottom: 10, borderRadius: 5, borderWidth: 0 }}
							containerStyle={{ paddingLeft: 0, paddingRight: 0, borderWidth: 0 }}
							inputStyle={{ borderWidth: 0.5, borderColor: "silver", borderRadius: 7, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
							value={this.state["description"]}
							onChangeText={(description) => this.setState({ description })}
							disabled={(action === "show") ? true : false}
						/>
						{this.state["user"]["type"] === "empresa" && <View style={{}}>
							<Text style={[{ fontFamily: "Raleway-Bold", marginBottom: 5, color: "#273861", fontSize: 17 }]}>Colaborador *</Text>
							<MultiSelect
								hideTags hideDropdown hideSubmitButton single
								//enabled={(this.props["navigation"].state.params["action"] !== "show") ? true : false}
								items={this.state["collaborators"]}
								uniqueKey="id"
								displayKey="name"
								onSelectedItemsChange={(selectedItems) => { this.setState({ collaborator: selectedItems[0] }) }}
								selectedItems={[this.state["collaborator"]]}
								tagTextColor="#CCC"
								selectedItemTextColor="#CCC"
								itemTextColor="#000"
								styleDropdownMenu={{ marginHorizontal: 10, marginTop: 5 }}
								searchInputPlaceholderText="Buscar..."
								selectText="Seleccione"
							/>
						</View>
						}
						<View style={{ marginHorizontal: 10, marginVertical: 5 }}>
							<Text style={[{ fontFamily: "Raleway-Italic", fontSize: 13, color: "#8d8d8d" }]}>Nota:  * (campo obligatorio)</Text>
						</View>
						<Button title={(action === "add") ? "APLICAR AL SERVICIO" : "EDITAR EL SERVICIO"} buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
							disabled={this.state["buttonDisabled"]}
							titleStyle={{ fontFamily: "Raleway-Bold" }}
							containerStyle={{ display: (action === "show") ? "none" : "flex", marginHorizontal: 25, marginVertical: 20 }}
							onPress={this.sendOfert}
						/>
					</View>
				</ScrollView >
			</KeyboardAwareScrollView >
		)
	}
}