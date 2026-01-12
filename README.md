# Quantum Sounds: Sonificación de Sistemas Cuánticos

**Quantum Sounds** es un simulador interactivo de un sistema de **2-qubits** que utiliza la síntesis de audio en tiempo real para representar fenómenos de la mecánica cuántica. El proyecto permite "escuchar" la superposición, el entrelazamiento y el colapso de la función de onda, transformando conceptos matemáticos abstractos en experiencias psicoacústicas.

---

## Conceptos de Ingeniería y Física

Este proyecto mapea el álgebra lineal de los estados cuánticos a parámetros audibles:

* **Representación de Qubits:** * Estado $|0\rangle$: Tono grave puro (200 Hz).
    * Estado $|1\rangle$: Tono agudo puro (800 Hz).
* **Superposición:** Se implementa mediante la suma de señales de osciladores independientes. La amplitud de cada tono es proporcional a la raíz cuadrada de la probabilidad del estado ($| \alpha | = \sqrt{P}$).
* **Fase Cuántica:** La interferencia de fase se representa mediante el **detuning** (desafinación), creando "batidos" sonoros que el oído humano percibe como una vibración o inestabilidad.
* **Entrelazamiento (Estados de Bell):** Se manifiesta mediante la correlación espacial. Por ejemplo, el estado $\Psi^+$ utiliza un **LFO (Low Frequency Oscillator)** para alternar el paneo estéreo entre el oído izquierdo y derecho.



---

## Herramientas Utilizadas

* **Web Audio API:** Motor principal para la generación y manipulación de ondas senoidales, nodos de ganancia (GainNodes) y paneo estéreo en tiempo real.
* **JavaScript :** Lógica matemática para el procesamiento de las amplitudes cuánticas y simulación de compuertas.
* **HTML5:** Interfaz de usuario diseñada con un enfoque de consola técnica.

---

## Instrucciones de Operación

Puedes manipular el estado cuántico utilizando los siguientes controles:

| Tecla | Operación Cuántica | Efecto Sonoro |
| :--- | :--- | :--- |
| `↑` | **Puerta Hadamard (H)** | Pone al sistema en superposición máxima. |
| `C` | **Puerta CNOT** | Entrelaza el Qubit A con el B. |
| `←` | **Puerta Z (Fase)** | Introduce una fase negativa (genera batido sonoro). |
| `→` | **Puerta Pauli-X (B)** | Invierte el estado lógico del Qubit B. |
| `Espacio` | **Medición** | Colapsa la función de onda a un estado clásico $|00\rangle, |01\rangle, |10\rangle$ o $|11\rangle$. |
| `Enter` | **Reset** | Reinicia el sistema al estado base $|00\rangle$. |

---

## Simulación del Colapso 

El sistema utiliza una simulación de Monte Carlo para determinar el resultado clásico final basado en las probabilidades actuales:
$$P(i) = |a_i|^2$$



---

---

## 🏆 Reconocimientos

Este proyecto fue desarrollado para la **Hackathon de Quantum Quipu 2025**, donde obtuvo el **2do Puesto** a nivel nacional. 

**Desarrolladores:**
* **Rodrigo Quiroz** (UNMSM)
* **Alexis Salvatierra** (UNMSM)

---
*Explorando la intersección entre la computación cuántica y la ingeniería de sonido.*
