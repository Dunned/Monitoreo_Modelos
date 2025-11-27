# Monitoreo y Ciclo de Vida de Modelos de Machine Learning

Este repositorio contiene el código fuente y la documentación para un sistema integral de Machine Learning, abarcando desde la fase de experimentación y desarrollo del modelo hasta su implementación en una interfaz web para el monitoreo continuo (Model Monitoring).

El proyecto tiene como objetivo demostrar un flujo de trabajo MLOps básico, asegurando la reproducibilidad del entrenamiento y la accesibilidad de las métricas de rendimiento a través de un dashboard moderno.

## Descripción General

La solución se estructura en dos módulos principales:
1. **Desarrollo del Modelo (Backend):** Scripts y Notebooks en Python encargados del procesamiento de datos, entrenamiento algorítmico y validación estadística.
2. **Interfaz de Monitoreo (Frontend):** Aplicación web desarrollada con Vite y React que consume los resultados y artefactos del modelo para visualizar su comportamiento.

## Flujo de Desarrollo del Modelo

El ciclo de vida del modelo, documentado en el archivo `Desarrollo_Modelo.ipynb`, sigue una metodología estándar de Ciencia de Datos estructurada en las siguientes etapas:

### 1. Ingesta y Exploración de Datos (EDA)
- Carga del conjunto de datos desde la carpeta `data/`.
- Análisis estadístico descriptivo para comprender la distribución de las variables.
- Identificación de valores atípicos (outliers) y correlaciones entre características.

### 2. Preprocesamiento e Ingeniería de Características
- Limpieza de datos: Imputación de valores nulos y tratamiento de duplicados.
- Transformación de variables: Codificación de variables categóricas (One-Hot Encoding / Label Encoding) y normalización/escalado de variables numéricas.
- Selección de características: Identificación de las variables más relevantes para la predicción.

### 3. Entrenamiento del Modelo
- División del dataset en conjuntos de entrenamiento (train) y prueba (test) para garantizar una validación objetiva.
- Selección y configuración de algoritmos de aprendizaje supervisado.
- Ajuste de hiperparámetros para optimizar el rendimiento.

### 4. Evaluación y Validación
- Cálculo de métricas de desempeño: Precisión (Accuracy), Sensibilidad (Recall), F1-Score y Matriz de Confusión.
- Análisis de la curva ROC y AUC para medir la capacidad de discriminación del modelo.
- Generación de gráficos de reporte almacenados en la carpeta `figures/`.

### 5. Serialización (Exportación)
- El modelo entrenado y los objetos de preprocesamiento se guardan en formato binario (pickle/joblib) en la carpeta `models/` para su posterior integración con la aplicación web.

## Estructura del Repositorio

- /data: Conjuntos de datos crudos y procesados.
- /figures: Gráficos generados durante el análisis y validación.
- /models: Artefactos del modelo serializados (.pkl, .h5).
- /src: Código fuente de la aplicación web (Frontend).
- Desarrollo_Modelo.ipynb: Notebook principal con el pipeline de ML.
- requirements.txt: Dependencias y librerías de Python.
- package.json: Dependencias del entorno de Node.js.

## Instalación y Uso

### Requisitos Previos
- Python 3.8 o superior.
- Node.js y npm (para el dashboard).

### Configuración del Modelo (Python)
1. Instalar las dependencias listadas:
   pip install -r requirements.txt

2. Ejecutar el notebook de desarrollo para entrenar el modelo:
   jupyter notebook Desarrollo_Modelo.ipynb

### Configuración del Dashboard (Web)
1. Instalar las dependencias del proyecto web:
   npm install

2. Iniciar el servidor de desarrollo:
   npm run dev

## Tecnologías Utilizadas
- Lenguaje de Modelado: Python (Pandas, Scikit-learn, Matplotlib).
- Framework Web: Vite + React.
- Estilos: Tailwind CSS.

## Licencia
Este proyecto se distribuye bajo la licencia MIT.