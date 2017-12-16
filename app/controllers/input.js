import Controller from '@ember/controller';
import math from 'npm:mathjs';

export default Controller.extend({

  actions: {

    calculated: false,
    result: {},
    fixedRealVoltages: [],
    fixedRealPowers: [],
    sourceCurrent: '',
    approved: '',

    numfixS:null,
    psuS:null,
    ldrS:null,
    jmpS:null,
    wpxS:null,

    init() {
      this._super(...arguments);
      //console.log('controller init function');
      this.set('numfixS',null);
      this.set('psuS',null);
      this.set('ldrS',null);
      this.set('jmpS',null);
      this.set('wpxS',null);
    },

    //results: this.get('results'),

//onClick command for calculate button

    calculateValue: function() {

//checking for and defining static variables for the calculation

      var supplyPower = this.get('psuS').get('supplyPower'); //PT *corresponds with matlab code*
      //console.log(supplyPower);
      var supplyVoltage = this.get('psuS').get('supplyVoltage'); //VS
      //console.log(supplyVoltage);
      var ldrIntRes = this.get('ldrS').get('ldrIntRes'); //RL
      //console.log(ldrIntRes);
      var jmpIntRes = this.get('jmpS').get('jmpIntRes'); //RJ
      //console.log(jmpIntRes);
      var wpxIntRes = this.get('wpxS').get('wpxIntRes'); //RI
      //console.log(wpxIntRes);
      var wpxPower = this.get('wpxS').get('wpxPower'); //P0
      //console.log(wpxPower);
      var wpxIndex = this.get('wpxS').get('id');
      //console.log(wpxIndex);
      var numfix = this.get('numfixS');  //N
      //console.log(numfix);

      //initializing recursive variables

      var V = supplyVoltage; //Vth ('thevenin voltage')
      //console.log(V);
      var Q = ldrIntRes;     //Rth ('thevenin resistance')
      //console.log(Q);
      var P = wpxPower;
      //console.log(P);
      var R = wpxIntRes;
      //console.log(R);

      //initialize mathjs variables

      var parser = math.parser();

      parser.set("V",V);
      parser.set("Q",Q);
      parser.set("P",P);
      parser.set("R",R);
      parser.set("RJ",jmpIntRes);
      parser.set("RL",ldrIntRes);
      parser.set("RI",wpxIntRes);

//defining equations as strings to be used with mathjs commands for voltage

//one board

      var vAeq = "1";
      var vBeq = "-V";
      var vCeq = "P*Q";
      var vDeq = "vB^2-(4*vA*vC)";

      var Qeq2 = "(V/Isc)+RJ+RI"

      var expression3 = "(-vB+sqrt(vD))/(2*vA)"

      var iAeq = "Q+(RJ+RI)";
      var iBeq = "-((RJ+RI)*V)";
      var iCeq = "P*Q*(RI+RJ)";
      var iDeq = "pow(iB,2)-(4*iA*iC)";

      var Isceq2 ="(-iB+sqrt(iD))/(2*iA*(RI+RJ))";

//two boards
      var expression1 = "-(-Q*V-2*R*V)/(4*(Q+R))+1/2*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)))+1/2*sqrt((-Q*V-2*R*V)^2/(2*(Q+R)^2)-(4*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))-(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))-(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))+(-(-Q*V-2*R*V)^3/(Q+R)^3+(4*(2*P*Q^2+2*P*R*Q+R*V^2)*(-Q*V-2*R*V))/(Q+R)^2+(16*P*Q*R*V)/(Q+R))/(4*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)))))";

      var expression2 = "-((-R*V+Q*(-(-Q*V-2*R*V)/(4*(Q+R))+1/2*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)))+1/2*sqrt((-Q*V-2*R*V)^2/(2*(Q+R)^2)-(4*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))-(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))-(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))+(-(-Q*V-2*R*V)^3/(Q+R)^3+(4*(2*P*Q^2+2*P*R*Q+R*V^2)*(-Q*V-2*R*V))/(Q+R)^2+(16*P*Q*R*V)/(Q+R))/(4*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))))))+R*(-(-Q*V-2*R*V)/(4*(Q+R))+1/2*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)))+1/2*sqrt((-Q*V-2*R*V)^2/(2*(Q+R)^2)-(4*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))-(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))-(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))+(-(-Q*V-2*R*V)^3/(Q+R)^3+(4*(2*P*Q^2+2*P*R*Q+R*V^2)*(-Q*V-2*R*V))/(Q+R)^2+(16*P*Q*R*V)/(Q+R))/(4*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)))))))*((-(-Q*V-2*R*V)/(4*(Q+R))+1/2*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)))+1/2*sqrt((-Q*V-2*R*V)^2/(2*(Q+R)^2)-(4*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))-(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))-(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))+(-(-Q*V-2*R*V)^3/(Q+R)^3+(4*(2*P*Q^2+2*P*R*Q+R*V^2)*(-Q*V-2*R*V))/(Q+R)^2+(16*P*Q*R*V)/(Q+R))/(4*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))))))^2-V*(-(-Q*V-2*R*V)/(4*(Q+R))+1/2*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)))+1/2*sqrt((-Q*V-2*R*V)^2/(2*(Q+R)^2)-(4*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))-(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))-(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))+(-(-Q*V-2*R*V)^3/(Q+R)^3+(4*(2*P*Q^2+2*P*R*Q+R*V^2)*(-Q*V-2*R*V))/(Q+R)^2+(16*P*Q*R*V)/(Q+R))/(4*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))))))+P*Q))/(P*Q^2)";

      var Aeq = "(R^2)*((1/Q)+(1/R))";
      var Beq = "-(V/Q)*R";
      var Ceq = "wpxPower";

      var Isceq = "(sqrt(B^2-4*A*C)-B)/(2*A)";

      var Qeq = "(V/Isc)+RJ";

//initializing for loop variables for two board voltage

      var i, nodeVoltages1, nodeVoltages2, QREC, A, B, C, Isc;

      var counter = 0;
      var xlength = [counter,];

//initializing for loop variables for power

      var PT,PRL,PB1,PRI,PB2,PRJ,totalPower,V1,V2

      PT=0;
      parser.set("PT",PT);
      var PRIeq="(V1-V2)^2/RI";
      var PT1eq="PT+PRL+P+PRI+P";
      var PT2eq="PT+PRJ+P+PRI+P";

//using for loop function to create result array for results

      var results = calc(supplyVoltage,ldrIntRes,jmpIntRes,wpxIntRes,wpxPower,numfix);

//making sure voltages array is only real, fixed values

      var realVoltages2 = results.nodeVoltages2.map((x) => x && x.hasOwnProperty('re') ? x.re :x);

      var realPowers = results.totalPower.map((x) => x && x.hasOwnProperty('re') ? x.re :x);

      var fixedRealVoltages = fixVoltages(realVoltages2);

      var fixedRealPowers = fixPowers(realPowers);
      //console.log(results)
      //console.log(realVoltages2)
      //console.log(fixedRealVoltages)
      //console.log(fixedRealPowers)

      function fixVoltages(realVoltages2) {

        var j,fixedVoltage,voltageToFix

        for (j=0,fixedRealVoltages=[]; j < realVoltages2.length; j++) {
          voltageToFix = realVoltages2[j];
          fixedVoltage = voltageToFix.toFixed(3);
          fixedRealVoltages.push(fixedVoltage);
        }
        return fixedRealVoltages
      };

      function fixPowers(realPowers) {

        var k,fixedPower,powerToFix

        for (k=0,fixedRealPowers=[]; k < realPowers.length; k++) {
          powerToFix = realPowers[k];
          fixedPower = powerToFix.toFixed(3);
          fixedRealPowers.push(fixedPower);
        }
        return fixedRealPowers
      };

      if (fixedRealPowers[numfix] != "NaN") {
        var I = fixedRealPowers[numfix]/supplyVoltage;
        var sourceCurrent = I.toFixed(3);
      } else {
        var sourceCurrent = "NaN";
      }

      this.set('calculated',true);
      this.set('result',results);
      this.set('fixedRealVoltages',fixedRealVoltages);
      this.set('fixedRealPowers',fixedRealPowers);
      this.set('sourceCurrent', sourceCurrent);

//approves/disapproves system combination

      if ((fixedRealVoltages[numfix] > 42) && (fixedRealPowers[numfix] < 580) && (fixedRealPowers[numfix] != "NaN") && (sourceCurrent < 12.5) && (sourceCurrent != "NaN")) {
        var approveMessage = 'Great! It looks like this system is compatible.';
        this.set('approved', approveMessage)
      } else {
        var disapproveMessage = "I'm sorry, this system is incompatible. Please use the dropdowns above and try another combination.";
        this.set('approved', disapproveMessage)
      }

//defining the looping function to calculate values used to define result

      function calc(supplyVoltage,ldrIntRes,jmpIntRes,wpxIntRes,wpxPower,numfix) {

        if (wpxIndex > 4) {

          for (i=0,nodeVoltages2=[supplyVoltage],nodeVoltages1=[supplyVoltage],totalPower=[PT]; i < numfix; i++) {

            //console.log(parser.get("V"),parser.get("Q"),parser.get("Isc"));

            V = parser.get("V");
            Q = parser.get("Q");

  //evaluates node voltage at LED board 1 of fixture[i]

            var nodeVoltage1 = parser.eval(expression1);
            //console.log(nodeVoltage1);

  //evaluates node voltage at LED board 2 of fixture[i]

            var nodeVoltage2 = parser.eval(expression2);
            //console.log(nodeVoltage2);

  //adds values to result array for analysis

            nodeVoltages1.push(nodeVoltage1);
            nodeVoltages2.push(nodeVoltage2);

  //using mathjs to evaluate

            A = parser.eval(Aeq);
            parser.set("A",A)
            B = parser.eval(Beq);
            parser.set("B",B);
            C = wpxPower;
            parser.set("C",C);

  //short circuit current: NOT REAL VALUE FOR CURRENT

            Isc = parser.eval(Isceq);
            parser.set("Isc",Isc);

  //sets V (Voc) for next iteration
            V1= nodeVoltage1;
            parser.set("V1",V1);

            V2= nodeVoltage2;
            parser.set("V2",V2);

            V = nodeVoltage2;
            parser.set("V",V);

  //sets Q (Rth) for next iteration

            Q = parser.eval("(V/Isc)+RJ");
            parser.set("Q",Q);

    //calc function calculates power dissipated

            if (i < 2) {
              PRL=Math.pow((nodeVoltages2[0]-nodeVoltages2[1]),2)/ldrIntRes;
              PRI=parser.eval(PRIeq);

              parser.set("PRL",PRL);
              parser.set("PRI",PRI);
              parser.get("PT");

              PT=parser.eval(PT1eq);
              parser.set("PT",PT);
              totalPower.push(PT);
            } else {
              PRI=parser.eval(PRIeq);
              PRJ=Math.pow((nodeVoltages2[i-1]-nodeVoltages1[i]),2)/jmpIntRes;

              parser.set("PRJ",PRJ);
              parser.set("PRI",PRI);
              parser.get("PT");

              PT=parser.eval(PT2eq);
              parser.set("PT",PT);
              totalPower.push(PT);
            };

          };

        } else {

          for (i=0,nodeVoltages2=[supplyVoltage],totalPower=[PT]; i < numfix; i++) {

            //console.log(parser.get("V"),parser.get("Q"),parser.get("Isc"));

            V = parser.get("V");
            Q = parser.get("Q");
            var RJ = parser.get("RJ");
            var RI = parser.get("RI");

  //evaluates node voltage at LED board of fixture[i]
            var vA = parser.eval(vAeq);
            parser.set("vA",vA);
            var vB = parser.eval(vBeq);
            parser.set("vB",vB);
            var vC = parser.eval(vCeq);
            parser.set("vC",vC);
            var vD = parser.eval(vDeq);
            parser.set("vD",vD);

            var nodeVoltage = parser.eval(expression3);
  //adds values to result array for analysis

            nodeVoltages2.push(nodeVoltage);
  //evaluates short circuit current at fixture[i]

            var iA = parser.eval(iAeq);
            parser.set("iA",iA);
            var iB = parser.eval(iBeq);
            parser.set("iB",iB);
            var iC = parser.eval(iCeq);
            parser.set("iC",iC);
            var iD = parser.eval(iDeq);
            parser.set("iD",iD);

  //short circuit current: NOT REAL VALUE FOR CURRENT

            Isc = parser.eval(Isceq2);
            parser.set("Isc",Isc);

  //sets V (Voc) for next iteration

            V = nodeVoltage;
            parser.set("V",V);

  //sets Q (Rth) for next iteration

            Q = parser.eval(Qeq2);
            parser.set("Q",Q);

    //calc function calculates power dissipated

            if (i < 2) {
              var V1 = 48;
              parser.set("V1",V1);
              var V2 = V;
              parser.set("V2",V2);

              var PRLeq = "((V1-V2)^2)/RL";
              var PRL = parser.eval(PRLeq);

              parser.set("PRL",PRL);
              parser.get("PT");

              PT = parser.eval("PT+PRL+P");
              parser.set("PT",PT);
              totalPower.push(PT);

            } else {

              var V1 = nodeVoltages2[i-1];
              parser.set("V1",V1);
              var V2 = nodeVoltages2[i];
              parser.set("V2",V2);

              var PRIJeq = "((V1-V2)^2)/(RJ+RI)";
              var PRIJ = parser.eval(PRIJeq);

              parser.set("PRIJ",PRIJ);
              parser.get("PT");

              PT=parser.eval("PT+PRIJ+P");
              parser.set("PT",PT);
              totalPower.push(PT);

            };

          };

        }
//calc function returns the important node voltages

        return {
          nodeVoltages2,
          totalPower
        };

      };

    }
  }
});
