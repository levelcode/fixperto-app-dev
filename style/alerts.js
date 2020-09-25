import { StyleSheet } from 'react-native';

const general = StyleSheet.create({
	container: {
		justifyContent: "center",
		backgroundColor : "#ffffff",
		padding : 20, 
		flexDirection : "column",
		borderRadius : 10
	}
})

const alerts = StyleSheet.create({
	cont: {
		alignItems: "center",
		paddingVertical : 20,
	},

	borderAlert: {
		borderColor: "#fbdcc9",
		borderWidth: 5,
		width: 110,
		height: 110,
		borderRadius: 55,
	},

	contAlert: {
		backgroundColor: "#fbdcc9",
		width: 90,
		padding: 20,
		borderRadius: 50,
		marginLeft: 5,
		marginTop: 5

	},
	
	contAlertImg: {
		width: 50,
		height: 50,
		margin: "auto"
	},

	title: {
		textAlign: "center",
		fontFamily: "Raleway-Bold",
		fontSize: 20,
		marginTop: 5,
	},
	desc: {
		textAlign: "center",
		fontSize: 18,
	},
	btnOk: {
		textAlign: "center",
		fontFamily: "Raleway-Bold",
		color: "white",
		fontSize: 20,
		marginTop: 15,
		backgroundColor: "#43AECC",
		textTransform: "uppercase",
		borderRadius: 5,
		paddingTop: 10,
		paddingBottom: 10, 
		width : 250
	}

})





export { general, alerts };

