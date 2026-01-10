
// 1. ESTADO CUÁNTICO


//Probabilidad cuantica de cada estado.
//a00:1, el estado 00 esta presente, el eatdo 01,10,11 no esta presente
let state = { a00: 1, a01: 0, a10: 0, a11: 0 };


// 2 v                                          . AUDIO

//Se crea el moto de sonido en el navegador:
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

//Cada qubit(A Y B) tiene 2 osciladores con frecuencia /0> Y /1>
//oscA0, qubit A en estado 0
//oscA1 qubit A en estado 1
//oscB0 qubit B en estado 0
//oscB1 qubit B en estado 1
let oscA0, oscA1, oscB0, oscB1;
//Las ganacias prepesentan las probabilidades
// mayor amplitud---> mas volumen
let gainA0, gainA1, gainB0, gainB1;
//Qubit A(izquierdo), Qbit B(derecho) --> representan el entrelazamiento espacial
let panA, panB, masterGain;

// LFO para alternancia Ψ, oscilacion lenta que mueve el sonido de izquierda a derecha
//Representa la correlacion cruzada /1> y /0>
let lfo, lfoGain;


// 3. CREAR AUDIO

function createAudio() {
  if (oscA0) return;
//Control del volumen global
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 1;
  masterGain.connect(audioCtx.destination);

  oscA0 = audioCtx.createOscillator();
  oscA1 = audioCtx.createOscillator();
  oscB0 = audioCtx.createOscillator();
  oscB1 = audioCtx.createOscillator();

  // /0> es 200hz (grave)
  // /1> ex 800hz (agudo)
  oscA0.frequency.value = 200;
  oscA1.frequency.value = 800;
  oscB0.frequency.value = 200;
  oscB1.frequency.value = 800;

  //La ganancia es el volumen proporcional a la amplitud cuantica de estado
  gainA0 = audioCtx.createGain();
  gainA1 = audioCtx.createGain();
  gainB0 = audioCtx.createGain();
  gainB1 = audioCtx.createGain();

  //El jugador puede percibir espacialmente la superposición o el entrelazamiento.
  panA = audioCtx.createStereoPanner();
  panB = audioCtx.createStereoPanner();
  //Los osciladores del qubit A se escuchan en el odio izquierdo
  panA.pan.value = -1;
  //Los osciladores del qubit B se escuchan en el odio derecho
  panB.pan.value = 1;

  // LFO para Ψ
  //lfo es un oscilador que geenra un cambio lento y periodico para alternar el sonido
  //entre izquierdo y derecho
  lfo = audioCtx.createOscillator();
  lfo.frequency.value = 0.6; //La alternancia ocurre 0.6 veces por segundo
  lfoGain = audioCtx.createGain();
  //Inicialmente no afecta, se activa solo cuando psi+ y psi-
  lfoGain.gain.value = 0;

  //Conecta lfo con un control de ganacia que modifica el panorama estero
  lfo.connect(lfoGain);
  //La señal se balancea entre oido izquierdo y derecho
  lfoGain.connect(panA.pan);
  lfoGain.connect(panB.pan);
  lfo.start();

  //Conexion de los osciladores al sistema de audio:
  //Cada oscilador se conecta a un gain node para controlar su volumen
  //Luego, se conecta a un panner estéreo (panA o panB) para decidir 
  // en qué oído se escuchará más fuerte.
  //Finalmente, se conecta al masterGain, que es el volumen general del audio.
  oscA0.connect(gainA0).connect(panA).connect(masterGain);
  oscA1.connect(gainA1).connect(panA).connect(masterGain);
  oscB0.connect(gainB0).connect(panB).connect(masterGain);
  oscB1.connect(gainB1).connect(panB).connect(masterGain);

  //Inicio de los osciladores
  oscA0.start(); oscA1.start();
  oscB0.start(); oscB1.start();
}


// 4. SONIDO BASE

function updateSound() {
  //Calculo de probabilidades de el qubit A:
  //A en 0, se suma las probabilidades de los estados a00 y a01
  const pA0 = state.a00**2 + state.a01**2;
   //A en 1, se suma las probabilidades de los estados a10 y a11
  const pA1 = state.a10**2 + state.a11**2;

  //Calculo de probabilidades de el qubit B :
  //B en 0, se suma las probabilidades de los estados a00 y a10
  const pB0 = state.a00**2 + state.a10**2;
  //B en 1, se suma las probabilidades de los estados a01 y a11
  const pB1 = state.a01**2 + state.a11**2;

  //gainA0 → controla el volumen del oscilador que representa A = 0
  // Math.sqrt(pA0), la amplitud de audio debe ser DP a la raiz de la probabilidad
  gainA0.gain.value = Math.sqrt(pA0);
  gainA1.gain.value = Math.sqrt(pA1);
  gainB0.gain.value = Math.sqrt(pB0);
  gainB1.gain.value = Math.sqrt(pB1);

  //Funcion que detecta si es uno de los 4 estados de Bell:
  applyBellSound();
  //Actualiza el mensaje en pantalla y color según el estado de Bell.
  detectBell();
}


// 5. SONIDO BELL
//
function applyBellSound() {
  // esp es un margen de tolerancia
  const eps = 0.01;
//Antes de aplicar cualquier efecto de Bell, se eliminan efectos anteriores:
//detune --> desafinación de los osciladores A1 y B1 (para generar batidos)
  oscA1.detune.value = 0;
  oscB1.detune.value = 0;
  //lfoGain.gain --> alternancia estéreo para Ψ⁺ y Ψ⁻
  lfoGain.gain.value = 0;

  // Φ+
  //  Se detecta el estado de bell 00 - 0.707 y si es muy pequeño señana un estado de bell
    if (Math.abs(state.a00 - 1/Math.SQRT2) < eps &&
      Math.abs(state.a11 - 1/Math.SQRT2) < eps) return;

  // Φ−
  //lo mismo
  if (Math.abs(state.a00 - 1/Math.SQRT2) < eps &&
  // el + detecta la fase negativa
      Math.abs(state.a11 + 1/Math.SQRT2) < eps) {
    // Si ambas condiciones se cumplen:
    //altera ligeramente la frecuencia del oscilador del qubit A para crear un “batido”
    oscA1.detune.value = 18;
    //altera ligeramente la frecuencia del oscilador del qubit B para crear un “batido”
    oscB1.detune.value = -18;
    //termina la función para no aplicar más cambios de sonido.
    return;
  }

  // Ψ+
  //Comprueba que la amplitud a01 ≈ 1/√2.
  if (Math.abs(state.a01 - 1/Math.SQRT2) < eps &&
      Math.abs(state.a10 - 1/Math.SQRT2) < eps) {

  //Activa un LFO (oscilador de baja frecuencia) que alterna el paneo estéreo de 
  // los sonidos.
  //Esto crea la sensación de que el sonido “salta” de oído izquierdo a derecho, 
  // representando la correlación cruzada de Ψ⁺
    lfoGain.gain.value = 0.8;
    return;
  }

  // Ψ−
  //Verifica a01 ≈ 1/√2
  if (Math.abs(state.a01 - 1/Math.SQRT2) < eps &&
  //(fase negativa)
      Math.abs(state.a10 + 1/Math.SQRT2) < eps) {
  //alternancia estéreo como Ψ⁺.
    lfoGain.gain.value = 0.8;
  //batido adicional por la fase negativa.
    oscA1.detune.value = 20;
    oscB1.detune.value = -20;
  }
}


// 6. FEEDBACK VISUAL
//Función que se encarga de actualizar el feedback visual según el estado de Bell actual
function detectBell() {
  //Define una tolerancia para comparar valores decimales
  const eps = 0.01;
  //Inicializa la variable msg con un texto por defecto
  //Si el estado no coincide con ningún Bell específico, se mostrará “Estado general”
  let msg = "Estado general";
  //Inicializa el color de fondo del mensaje en gris oscuro por defecto.
  let color = "#444";

  //comprueba que a00 ≈ 1/√2
  //comprueba que a11 ≈ 1/√2.
  //Si ambas son ciertas, el sistema está en Φ⁺, que es un estado estable.
  if (Math.abs(state.a00 - 1/Math.SQRT2) < eps &&
      Math.abs(state.a11 - 1/Math.SQRT2) < eps)
      //Se asigna el mensaje "Φ⁺ (estable)" y el color verde #4caf50.
    { msg = "Φ⁺ (estable)"; color = "#4caf50"; }

    //Esto identifica el estado Φ⁻.
    //Se asigna el mensaje "Φ⁻ (batido)" y el color naranja #ff9800.
  else if (Math.abs(state.a00 - 1/Math.SQRT2) < eps &&
           Math.abs(state.a11 + 1/Math.SQRT2) < eps)
    { msg = "Φ⁻ (batido)"; color = "#ff9800"; }

//Identifica el estado Ψ⁺, donde los qubits están correlacionados cruzadamente.
//Mensaje: "Ψ⁺ (alternancia estéreo)", color azul #2196f3.
  else if (Math.abs(state.a01 - 1/Math.SQRT2) < eps &&
           Math.abs(state.a10 - 1/Math.SQRT2) < eps)
    { msg = "Ψ⁺ (alternancia estéreo)"; color = "#2196f3"; }


  //Identifica Ψ⁻, que combina alternancia estéreo + batido.
  //Mensaje: "Ψ⁻ (alternancia + batido)", color rosa #e91e63.
  else if (Math.abs(state.a01 - 1/Math.SQRT2) < eps &&
           Math.abs(state.a10 + 1/Math.SQRT2) < eps)
    { msg = "Ψ⁻ (alternancia + batido)"; color = "#e91e63"; }
//Llama a la función setStatus para actualizar el texto y color del feedback 
// visual en la pantalla.
  setStatus("Estado: " + msg, color);
}


// 7. PUERTAS

//Calcula el valor 1/raiz2 que es el coeficiente que aparece al aplicar la puerta Hadamard.
//En física cuántica, Hadamard pone un qubit en superposición
function hadamardA() {
  const s = 1 / Math.SQRT2;
  //Estado de amplitud del sistema de 2 qubits
  state = { a00: s, a01: 0, a10: s, a11: 0 };
  //Llama a la función que actualiza los sonidos y el feedback visual según 
  //el nuevo estado.
  updateSound();
}

//Aplica la puerta CNOT con qubit A como control y qubit B como target.
//Intercambia las amplitudes de |10⟩ y |11⟩.
function cnot() {
  //Aplica la puerta CNOT con qubit A como control y qubit B como target.
  //Estado |10⟩ → qubit A = 1, qubit B = 0 → CNOT invierte B → nuevo estado |11⟩
  //Estado |00⟩ → qubit A = 0, qubit B = 0 → CNOT no cambia B → sigue |00⟩
  [state.a10, state.a11] = [state.a11, state.a10];
  //Actualiza el sonido y feedback visual con el nuevo estado.
  updateSound();
}


function phaseMinus() {
  //Aplica una fase de -1 al estado |11⟩
  //Esto es equivalente a la puerta Z en el qubit B controlado por A, 
  // cambiando solo la fase de |11⟩.

  //Cambia la fase relativa y provoca batido en el sonido.
  state.a11 *= -1;
  updateSound();
}

// ✅ ESTA ES LA CLAVE
//Esta es una puerta X (NOT) aplicada al qubit B.
//NOT en qubit B es simplemente invertir el qubit B sin depender de A.
//También cambia el feedback visual, mostrando Ψ⁺ o Ψ⁻ dependiendo de la fase.
function pauliX_B() {
  //Intercambia las amplitudes de |00⟩ y |01⟩ → invierte qubit B si qubit A=0.
  [state.a00, state.a01] = [state.a01, state.a00];
  //Intercambia las amplitudes de |10⟩ y |11⟩ → invierte qubit B si qubit A=1.
  [state.a10, state.a11] = [state.a11, state.a10];
  updateSound();
}


// 8. MEDICIÓN
//Defines la función medir.
function measure() {
  //Math.random() genera un número aleatorio uniforme entre 0 y 1
  //sto representa el azar cuántico fundamental
  const r = Math.random();
  //Variable donde se guardará el resultado clásico final
  // "00", "01", "10" o "11"
  let o;
  //Si el número aleatorio r cae dentro del rango:
  //0 ≤r< ∣a00​∣2, colapsa a 00
  if (r < state.a00**2) o = "00";
  //Importante:colapsa a |01⟩
  else if (r < state.a00**2 + state.a01**2) o = "01";
  //colapsa a |10⟩
  //∣a00​∣2 + ∣a01​∣2 ≤ r <∣a00​∣2 + ∣a01​∣2 + ∣a10​∣2

  //Si r no cayó en ningún rango anterior, forzosamente cae aquí:
  //colapsa a |11⟩
  //a00​∣2 + ∣a01​∣2 + ∣a10​∣2 ≤ r ≤ 1
  else if (r < state.a00**2 + state.a01**2 + state.a10**2) o = "10";
  else o = "11";
  //Muestra en pantalla el resultado clásico
  //Cambia el color a púrpura → evento definitivo
  setStatus("Medición: |" + o + "⟩", "#9c27b0");
}


// 9. RESET
//Se resetea
//> es como volver a preparar el experimento desde cero, 
// antes de cualquier puerta cuántica.
function resetAll() {
  state = { a00:1, a01:0, a10:0, a11:0 };
  updateSound();
  setStatus("Estado inicial", "#1f1f1f");
}


// 10. STATUS
//msg → el mensaje que quieres mostrar  
//color → el color de fondo asociado al estado
function setStatus(msg, color) {
  const s = document.getElementById("status");
  s.innerText = msg;
  s.style.backgroundColor = color;
}


// 11. TECLADO
//Se activa cada vez que el usuario presiona una tecla
//e es el evento, contiene información sobre tecla presionada
document.addEventListener("keydown", e => {
  if (audioCtx.state === "suspended") audioCtx.resume();
  createAudio();

  if (e.key === "ArrowUp") hadamardA();
  if (e.key === "c" || e.key === "C") cnot();
  if (e.key === "ArrowLeft") phaseMinus();
  if (e.key === "ArrowRight") pauliX_B();
  if (e.key === " ") measure();
  if (e.key === "Enter") resetAll();
});
