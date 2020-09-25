import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet, View, AsyncStorage, TouchableOpacity, Platform } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Input, Button, Divider, ListItem } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import AlertModal from "../../componentes/alertView";
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { url } from "../../componentes/config";
export default class AtencionClienteVista extends Component {
	constructor(props) {
		super(props);
		this.state = {
			textoAlert: "", showAlert: false, show_add: false, show_view: false, user: {}, status: [], types: [], tickets: [], description: "", type: 0, response: "",
			ticket: { id: "", type_customer_support: "", status: "", date_registry: "", descriptions: [], answers: [] }
		}
	}
	getDatasCustomerSupport = () => {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			return fetch(url + 'seguridad/getDatasCustomerSupport', {
				method: "POST", headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ user: user["id"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) {
					this.setState({ show_add: false, show_view: false, user, status: responseJson.status, types: responseJson.types, tickets: responseJson.tickets, description: "", type: 0, response: "" });
				} else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
			}).catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
		})
	}
	getDataCustomerSupport = (id) => {
		return fetch(url + 'seguridad/getDataCustomerSupport', {
			method: "POST", headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				this.setState({ ticket: responseJson.ticket, show_view: true });
			} else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		}).catch((error) => {
			if (error.message === 'Timeout' || error.message === 'Network request failed') {
				this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
			}
		})
	}
	showAdd = () => { this.setState(prevState => ({ show_add: !prevState["show_add"] })) }
	crearTicket = () => {
		if (this.state["type"] === 0 || this.state["description"] === "") {
			this.setState({ showAlert: true, textoAlert: "Debe seleccionar el departamento y dar una descripción de su problema" });
		}
		else {
			return fetch(url + 'seguridad/addDataCustomerSupport', {
				method: "POST", headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ user: this.state["user"]["id"], type_customer_support: this.state["type"], description: this.state["description"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) {
					this.getDatasCustomerSupport();
				} else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
			}).catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
		}
	}
	responderTicket = () => {
		if (this.state["response"] === "") { this.setState({ showAlert: true, textoAlert: "Debe una respuesta" }); }
		else {
			return fetch(url + 'seguridad/responseDataCustomerSupport', {
				method: "POST", headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id: this.state["ticket"]["id"], response: this.state["response"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) {
					this.getDatasCustomerSupport();
				} else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
			}).catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
		}
	}
	closedTicket = id => {
		return fetch(url + 'seguridad/hideDataCustomerSupport', {
			method: "POST", headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				this.getDatasCustomerSupport();
			} else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		}).catch((error) => {
			if (error.message === 'Timeout' || error.message === 'Network request failed') {
				this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
			}
		})
	}
	render() {
		const { show_add, show_view, user, status, types, tickets, description, type, ticket, response } = this.state;
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
					<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
					<NavigationEvents onWillFocus={payload => { this.getDatasCustomerSupport() }} />
					<View style={[styles.view, { display: (show_add || show_view) ? "none" : "flex", }]}>
						<Button title="CREAR TICKET" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 5 }}
							disabled={this.state["buttonDisabled"]}
							titleStyle={{ fontFamily: "Raleway-Bold" }}
							containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
							onPress={() => this.showAdd()}
						/>
						<View style={{ flexDirection: "row", padding: 10, backgroundColor: "#49B0CD" }}>
							<Text style={[styles.textPrincipal, { flex: 0.12, fontSize: 16 }]}>ID</Text>
							<Text style={[styles.textPrincipal, { flex: 0.30, fontSize: 16 }]}>Depto.</Text>
							<Text style={[styles.textPrincipal, { flex: 0.22, fontSize: 16 }]}>Estado</Text>
							<Text style={[styles.textPrincipal, { flex: 0.28, textAlign: "center", fontSize: 16 }]}>Fecha</Text>
							<Text style={[styles.textPrincipal, { textAlign: "right", flex: 0.22, fontSize: 16 }]}>Acción</Text>
						</View>
						<ScrollView >
							{tickets.map((tick, i) => (
								<View key={i}>
									<ListItem
										containerStyle={{ borderTopWidth: 0.5, borderTopColor: "#E0E0E0", paddingHorizontal: 5 }}
										title={<TouchableOpacity
											onPress={() => { this.getDataCustomerSupport(tick["id"]) }}
											style={{ flexDirection: "row", alignItems: "flex-start" }}>
											<Text style={[{ textAlign: "left", flex: 0.10 }]}>{tick["id"]}</Text>
											<Text style={[{ textAlign: "left", flex: 0.30 }]}>{tick["type_customer_support"]}</Text>
											<Text style={[{ marginLeft: 5, flex: 0.20 }]}>{tick["status"]}</Text>
											<Text style={[{ flex: 0.30, textAlign: "center" }]}>{tick["date_registry"]}</Text>
										</TouchableOpacity>}
										chevron={
											<TouchableOpacity style={{ alignItems: "center" }}
												onPress={() => { this.closedTicket(tick["id"]) }}>
												<Ionicons name="ios-close-circle" color="#CE4343" size={30} style={{ marginLeft: -70 }} />
											</TouchableOpacity>
										}
									/>
									<Divider />
								</View>
							))}
						</ScrollView>
					</View>
					<View style={[styles.view, { marginTop: 20, display: (show_add) ? "flex" : "none" }]}>
						<Text style={[styles.title, { fontSize: 20, fontFamily: "Raleway-Bold" }]}>Nuevo ticket</Text>
						<Text style={[styles.coment, { fontFamily: "Raleway-Regular" }]}>Por favor, diligencia el siguiente formulario y proporciónenos los datos más precisos posible, para que podamos atender su solicitud rápidamente</Text>
						<Text style={[styles.text]}>Departamento *</Text>
						<MultiSelect
							hideTags hideDropdown hideSubmitButton single
							items={types}
							uniqueKey="id"
							displayKey="denomination"
							onSelectedItemsChange={(selectedItems) => { this.setState({ type: selectedItems[0] }) }}
							selectedItems={[type]}
							tagTextColor="#CCC"
							selectedItemTextColor="#CCC"
							itemTextColor="#000"
							styleDropdownMenu={{ marginHorizontal: 10, marginTop: 5 }}
							searchInputPlaceholderText="Buscar..."
							selectText="Seleccione..."
						/>
						<Text style={[styles.text, { marginTop: 15, marginBottom: 5 }]}>Comentario *</Text>
						<Input multiline
							inputStyle={{ borderWidth: 1, borderColor: "silver", borderRadius: 5, fontFamily: "Raleway-Regular", paddingLeft: 10 }}
							containerStyle={{ borderRadius: 5, marginBottom: 10, }}
							value={description}
							onChangeText={(description) => this.setState({ description })}
						/>
						<View style={{ flexDirection: "row", margin: 10 }}>
							<Button
								title="ENVIAR"
								buttonStyle={{ backgroundColor: "#43AECC", borderColor: "#43AECC", borderWidth: 1, marginRight: 10 }}
								titleStyle={{ fontFamily: "Raleway-Bold" }}
								containerStyle={{ flex: 0.5, marginLeft: 5 }}
								onPress={() => this.crearTicket()}
							/>
							<Button
								title="CERRAR"
								buttonStyle={{ borderColor: "#CE4343", borderWidth: 1, backgroundColor: "white" }}
								titleStyle={{ fontFamily: "Raleway-Bold", color: "#CE4343" }}
								containerStyle={{ flex: 0.5 }}
								onPress={() => this.setState({ show_add: false, description: "", type: 0 })}
							/>
						</View>
					</View>
					<View style={[styles.view, { marginTop: 20, display: (show_view) ? "flex" : "none" }]}>
						<Text style={[styles.title]}>Detalle del ticket</Text>
						<View style={[styles.viewFlex]}>
							<Text style={[styles.comentBold]}>ID: </Text>
							<Text style={[styles.textValue]}>{ticket["id"]}</Text>
						</View>
						<View style={[styles.viewFlex]}>
							<Text style={[styles.comentBold]}>Estado: </Text>
							<Text style={[styles.textValue]}>{ticket["status"]}</Text>
						</View>
						<View style={[styles.viewFlex]}>
							<Text style={[styles.comentBold]}>Fecha: </Text>
							<Text style={[styles.textValue]}>{ticket["date_registry"]}</Text>
						</View>
						<View style={[styles.viewFlex]}>
							<Text style={[styles.comentBold]}>Cliente: </Text>
							<Text style={[styles.textValue]}>{user["name"]}</Text>
						</View>
						<View style={[styles.viewFlex]}>
							<Text style={[styles.comentBold]}>Departamento: </Text>
							<Text style={[styles.textValue, { flex: 0.8 }]}>{ticket["type_customer_support"]}</Text>
						</View>
						<Divider style={{ marginVertical: 10 }} />
						<Text style={[styles.comentBold]}>Descripciones: </Text>
						{ticket["descriptions"].map((desc, i) => (
							<View key={i}>
								<Text style={[styles.textValue, { marginLeft: 15, marginBottom: 5 }]}>* {desc["description"]}</Text>
							</View>
						))}
						<Divider style={{ marginVertical: 10 }} />
						{ticket["answers"].length > 0 && <View >
							<Text style={[styles.comentBold, { marginTop: 5 }]}>Respuesta fixperto: </Text>
							{ticket["answers"].map((resp, i) => (
								<View key={i}>
									<Text style={[styles.textValue, { marginLeft: 15, marginBottom: 5 }]}>* {resp["response"]}</Text>
								</View>
							))}
							<Divider style={{ marginVertical: 10 }} />
						</View>}
						<View style={[{ marginTop: 10 }]}>
							<Text style={[styles.comentBold]}>Responder Ticket</Text>
							<Input multiline numberOfLines={10}
								inputStyle={{ borderWidth: 1, borderColor: "#ededed", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular", height: 80 }}
								containerStyle={{ borderRadius: 5, marginBottom: 10 }}
								value={response}
								onChangeText={(response) => this.setState({ response })}
							/>
						</View>
						<View style={{ flexDirection: "row", margin: 10 }}>
							<Button
								title="CERRAR"
								buttonStyle={{ backgroundColor: "#CE4343", }}
								titleStyle={{ fontFamily: "Raleway-Bold" }}
								containerStyle={{ flex: 0.5 }}
								onPress={() => this.setState({ show_view: false, response: "" })}
							/>
							<Button
								title="ENVIAR"
								buttonStyle={{ backgroundColor: "#43AECC", }}
								titleStyle={{ fontFamily: "Raleway-Bold" }}
								containerStyle={{ flex: 0.5, marginLeft: 5 }}
								onPress={() => this.responderTicket()}
							/>
						</View>
					</View>
				</ScrollView>
			</KeyboardAwareScrollView >
		)
	}
}
const styles = StyleSheet.create({
	scroll: { flex: 1, backgroundColor: "#FFFFFF" },
	view: { marginHorizontal: 10 },
	viewFlex: { flexDirection: "row", marginBottom: 10 },
	text: { marginLeft: 10, fontFamily: "Raleway-Bold", fontSize: 15, color: "#273861" },
	coment: { marginHorizontal: 10, fontSize: 15, marginBottom: 25, textAlign: "justify" },
	comentBold: { marginLeft: 10, fontSize: 16, textAlign: "justify", fontFamily: "Raleway-Bold", color: "#273861" },
	textValue: { fontSize: 15 },
	title: { marginLeft: 10, fontFamily: "Raleway-Bold", fontSize: 20, marginBottom: 10, color: "#273861" },
	textPrincipal: { marginLeft: 5, fontFamily: "Raleway-Bold", fontSize: 18, color: "#fff" }
})