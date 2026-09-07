# Evidencias de Práctica - HelpDesk Lite

*Materia:* Aplicaciones de Internet  
*Proyecto:* HelpDesk Lite - Sistema de gestión de tickets de soporte técnico   

Todas las capturas mencionadas en el archivo md se encuentran adjuntas en el archivo de evidencias pdf.

---

## 1. URL del Repositorio
- *Enlace de GitHub:*  https://github.com/G2Cutbzzz/HelpDeskLite.git

---

## 2. Capturas de la Interfaz

Se encuentran adjuntas en el documento word 

### 2.1 Vista en Escritorio
> Captura general de la pantalla completa en resolución de monitor/escritorio mostrando dashboard, controles y tarjetas.


### 2.2 Vista en Móvil
> Captura mediante las herramientas de desarrollo del navegador (DevTools / F12 en modo responsive) simulando un dispositivo móvil.


---

## 3. Pruebas Funcionales y Reglas de Negocio

### 3.1 Creación de Ticket y Folio Automático
> Evidencia del formulario completado y la posterior creación de la tarjeta con su folio consecutivo (HD-0001, HD-0002...).


### 3.2 Búsqueda en Tiempo Real
> Demostración de filtrado dinámico al escribir en el campo de búsqueda sin presionar submit ni recargar la página.


### 3.3 Filtro por Estado
> Tarjetas filtradas tras seleccionar uno de los botones de estado (por ejemplo, mostrando solo tickets en "En proceso").


### 3.4 Filtro por Prioridad
> Tarjetas filtradas seleccionando un nivel de prioridad desde el selector desplegable (ej. "Crítica" o "Alta").


---

## 4. Ciclo de Vida y Transiciones de Estado

### 4.1 Transición: Nuevo ➔ En proceso
> Tarjeta inicial con botón "Iniciar atención" y su cambio de estado y estilo al activarse.


### 4.2 Transición: En proceso ➔ Resuelto
> Tarjeta en atención con botón "Resolver" y su posterior actualización al estado resuelto.


### 4.3 Transición: Resuelto ➔ Cerrado
> Tarjeta resuelta con botón "Cerrar" y paso a estado final cerrado (sin botones de acción disponibles).


### 4.4 Bloqueo de Transición Inválida
> Alerta en pantalla tras forzar una transición no permitida (por ejemplo, ejecutar en consola changeTicketStatus(id, 'Cerrado') desde un ticket en estado Nuevo).


---

## 5. Persistencia de Datos

### 5.1 Datos Conservados en localStorage
> Inspección en DevTools de la clave HELPDESK_TICKETS_V1 en Application > Local Storage, mostrando los tickets aún en pantalla tras presionar recargar (F5).


---

## 6. Historial de Control de Versiones (GitFlow)

### 6.1 Git Graph (GitHub Network)
> Captura del grafo de ramas en GitHub (Insights > Network) o mediante la extensión Git Graph de VS Code, evidenciando las ramas feature/*, develop, release/1.0.0 y main.


### 6.2 Salida del Comando git log

```bash
git log --graph --oneline --decorate --all
```
 
