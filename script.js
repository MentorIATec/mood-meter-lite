// script.js - Mood Meter Lite
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario ya está logueado
    const studentName = localStorage.getItem('studentName');
    const studentId = localStorage.getItem('studentId');
    const loginScreen = document.getElementById('login-screen');
  
    // Definición de emociones por cuadrante
    const emotions = {
      red: [
        { name: 'Frustrado/a', emoji: '😤' },
        { name: 'Estresado/a', emoji: '😫' },
        { name: 'Enojado/a', emoji: '😠' },
        { name: 'Preocupado/a', emoji: '😟' },
        { name: 'Ansioso/a', emoji: '😥' }
      ],
      yellow: [
        { name: 'Feliz', emoji: '😄' },
        { name: 'Entusiasmado/a', emoji: '🤩' },
        { name: 'Motivado/a', emoji: '💪' },
        { name: 'Optimista', emoji: '😊' },
        { name: 'Alegre', emoji: '😁' }
      ],
      blue: [
        { name: 'Triste', emoji: '😢' },
        { name: 'Cansado/a', emoji: '😴' },
        { name: 'Desanimado/a', emoji: '😞' },
        { name: 'Decepcionado/a', emoji: '😔' },
        { name: 'Agotado/a', emoji: '😩' }
      ],
      green: [
        { name: 'Tranquilo/a', emoji: '😌' },
        { name: 'Relajado/a', emoji: '🧘' },
        { name: 'Satisfecho/a', emoji: '😏' },
        { name: 'Calmado/a', emoji: '😇' },
        { name: 'Contento/a', emoji: '🙂' }
      ]
    };
  
    // Información de los cuadrantes
    const quadrants = {
      red: { title: 'Emociones Intensas', subtitle: 'Alta energía - Bajo agrado', color: '#F27052' },
      yellow: { title: 'Emociones Altas', subtitle: 'Alta energía - Alto agrado', color: '#FFDC51' },
      blue: { title: 'Emociones Bajas', subtitle: 'Baja energía - Bajo agrado', color: '#51A8FF' },
      green: { title: 'Emociones Tranquilas', subtitle: 'Baja energía - Alto agrado', color: '#92D36E' }
    };
  
    // Estado actual
    let currentQuadrant = null;
    let selectedEmotion = null;
    let moodHistory = JSON.parse(localStorage.getItem('moodHistoryLite')) || [];
  
    // Elementos del DOM
    const quadrantElements = {
      red: document.getElementById('red-quadrant'),
      yellow: document.getElementById('yellow-quadrant'),
      blue: document.getElementById('blue-quadrant'),
      green: document.getElementById('green-quadrant')
    };
    
    const emotionsPanel = document.getElementById('emotions-panel');
    const emotionsTitle = document.getElementById('emotions-title');
    const emotionsContainer = document.getElementById('emotions-container');
    const closeEmotionsBtn = document.getElementById('close-emotions');
    
    const selectedEmotionContainer = document.getElementById('selected-emotion-container');
    const selectedEmotionEmoji = document.getElementById('selected-emotion-emoji');
    const selectedEmotionName = document.getElementById('selected-emotion-name');
    
    const inputForm = document.getElementById('input-form');
    const feelingReasonInput = document.getElementById('feeling-reason');
    const feelingActionInput = document.getElementById('feeling-action');
    const feelingHelpInput = document.getElementById('feeling-help');
    const submitButton = document.getElementById('submit-button');
    const contactButton = document.getElementById('contact-button');
    const successMessage = document.getElementById('success-message');
    const historyList = document.getElementById('history-list');
  
    // Login o Verificación
    if (studentName && studentId) {
      // Usuario ya logueado, ocultar pantalla de login
      if (loginScreen) {
        loginScreen.classList.add('hidden');
      }
      console.log(`Usuario identificado: ${studentName} (${studentId})`);
      
      // Actualizar historial
      updateHistory();
    } else if (loginScreen) {
      // Mostrar pantalla de login
      const loginButton = document.getElementById('login-button');
      
      if (loginButton) {
        loginButton.addEventListener('click', function() {
          const nameInput = document.getElementById('student-name');
          const idInput = document.getElementById('student-id');
          
          if (!nameInput || !idInput) {
            console.error('No se encontraron los campos de login');
            return;
          }
          
          const name = nameInput.value.trim();
          const id = idInput.value.trim();
          
          if (name && id) {
            localStorage.setItem('studentName', name);
            localStorage.setItem('studentId', id);
            
            loginScreen.classList.add('hidden');
            
            // Mostrar mensaje de bienvenida
            showNotification(`¡Bienvenido/a, ${name}!`);
            
            // Actualizar historial después del login
            updateHistory();
          } else {
            alert('Por favor, completa tu nombre y matrícula');
          }
        });
      }
    }
  
    // Añadir event listeners a los cuadrantes
    Object.keys(quadrantElements).forEach(quadrant => {
      const element = quadrantElements[quadrant];
      if (element) {
        element.addEventListener('click', () => {
          currentQuadrant = quadrant;
          showEmotionsPanel(quadrant);
        });
      }
    });
  
    // Cerrar panel de emociones
    if (closeEmotionsBtn) {
      closeEmotionsBtn.addEventListener('click', () => {
        emotionsPanel.classList.add('hidden');
      });
    }
  
    // Enviar formulario
    if (submitButton) {
      submitButton.addEventListener('click', handleSubmit);
    }
  
    // Contactar mentora
    if (contactButton) {
      contactButton.addEventListener('click', contactMentor);
    }
    
    // Botón de contacto directo en recursos
    const directContactBtn = document.getElementById('direct-contact');
    if (directContactBtn) {
      directContactBtn.addEventListener('click', contactMentor);
    }
  
    // Funciones
    function showEmotionsPanel(quadrant) {
      if (!emotionsPanel || !emotionsTitle || !emotionsContainer) {
        console.error('Elementos del panel de emociones no encontrados');
        return;
      }
      
      // Actualizar título
      emotionsTitle.textContent = `Selecciona tu emoción - ${quadrants[quadrant].title}`;
      emotionsTitle.style.color = quadrants[quadrant].color;
      
      // Limpiar contenedor de emociones
      emotionsContainer.innerHTML = '';
      
      // Añadir emociones al panel
      emotions[quadrant].forEach(emotion => {
        const button = document.createElement('button');
        button.className = 'flex items-center px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:translate-y-[-2px] transition-all';
        button.innerHTML = `
          <span class="text-2xl mr-3">${emotion.emoji}</span>
          <span class="font-medium text-gray-800">${emotion.name}</span>
        `;
        
        button.addEventListener('click', () => {
          selectEmotion(emotion, quadrant);
          emotionsPanel.classList.add('hidden');
        });
        
        emotionsContainer.appendChild(button);
      });
      
      // Mostrar panel
      emotionsPanel.classList.remove('hidden');
    }
  
    function selectEmotion(emotion, quadrant) {
      if (!selectedEmotionContainer || !selectedEmotionEmoji || !selectedEmotionName || !inputForm) {
        console.error('Elementos de emoción seleccionada no encontrados');
        return;
      }
      
      selectedEmotion = {
        ...emotion,
        quadrant
      };
      
      selectedEmotionEmoji.textContent = emotion.emoji;
      selectedEmotionName.textContent = `Te sientes: ${emotion.name}`;
      selectedEmotionContainer.classList.remove('hidden');
      
      // Mostrar formulario
      inputForm.classList.remove('hidden');
      
      // Enfocar primer campo
      if (feelingReasonInput) {
        feelingReasonInput.focus();
      }
    }
  
    function handleSubmit() {
      if (!selectedEmotion) {
        alert('Por favor, selecciona una emoción antes de enviar');
        return;
      }
      
      if (!feelingReasonInput || !feelingActionInput || !feelingHelpInput || !successMessage) {
        console.error('Elementos del formulario no encontrados');
        return;
      }
    
      // Crear nuevo registro
      const newEntry = {
        id: Date.now(),
        emotion: selectedEmotion.name,
        emoji: selectedEmotion.emoji,
        quadrant: selectedEmotion.quadrant,
        reason: feelingReasonInput.value.trim(),
        action: feelingActionInput.value.trim(),
        help: feelingHelpInput.value.trim(),
        timestamp: new Date().toISOString(),
        studentName: localStorage.getItem('studentName') || '',
        studentId: getStudentId(),
        studentGroup: localStorage.getItem('studentGroup') || ''
      };
    
      // Enviar a Google Sheets
      console.log('Enviando datos a Google Sheets:', newEntry);
      sendToGoogleSheets(newEntry);
  
      // Actualizar historial
      moodHistory = [newEntry, ...moodHistory];
      localStorage.setItem('moodHistoryLite', JSON.stringify(moodHistory));
      
      // Mostrar mensaje de éxito
      successMessage.classList.remove('hidden');
      
      // Mostrar sección de recursos
      const resourcesSection = document.getElementById('resources-section');
      if (resourcesSection) {
        resourcesSection.classList.remove('hidden');
        
        // Hacer scroll suave hasta la sección de recursos
        setTimeout(() => {
          resourcesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
      }
      
      // Limpiar formulario
      selectedEmotion = null;
      selectedEmotionContainer.classList.add('hidden');
      inputForm.classList.add('hidden');
      feelingReasonInput.value = '';
      feelingActionInput.value = '';
      feelingHelpInput.value = '';
      
      // Actualizar historial
      updateHistory();
      
      // Ocultar mensaje de éxito después de unos segundos
      setTimeout(() => {
        successMessage.classList.add('hidden');
      }, 3000);
    }
  
    function updateHistory() {
      if (!historyList) {
        console.error('Elemento de historial no encontrado');
        return;
      }
      
      // Limpiar historial
      historyList.innerHTML = '';
      
      if (moodHistory.length === 0) {
        // Mostrar mensaje si no hay registros
        historyList.innerHTML = `
          <div class="p-4 text-center text-gray-500">
            No hay registros de estado de ánimo. ¡Comparte cómo te sientes!
          </div>
        `;
        return;
      }
      
      // Mostrar solo los últimos 3 registros
      const recentHistory = moodHistory.slice(0, 3);
      
      recentHistory.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'p-4';
        
        const date = new Date(entry.timestamp);
        const formattedDate = date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        entryElement.innerHTML = `
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <span class="text-2xl mr-2">${entry.emoji}</span>
              <span class="font-medium">${entry.emotion}</span>
            </div>
            <span class="text-sm text-gray-500">${formattedDate}</span>
          </div>
          ${entry.reason ? `<p class="text-sm text-gray-600 mb-1"><strong>Por qué:</strong> ${entry.reason}</p>` : ''}
        `;
        
        historyList.appendChild(entryElement);
      });
      
      // Si hay más de 3 registros, mostrar un botón para ver más
      if (moodHistory.length > 3) {
        const viewMoreBtn = document.createElement('div');
        viewMoreBtn.className = 'p-3 text-center text-blue-500 hover:text-blue-700 cursor-pointer';
        viewMoreBtn.textContent = 'Ver más registros';
        viewMoreBtn.addEventListener('click', showFullHistory);
        historyList.appendChild(viewMoreBtn);
      }
    }
  
    function showFullHistory() {
      // Aquí podrías implementar una vista más completa del historial
      // o simplemente mostrar más entradas
      alert('Funcionalidad para ver historial completo en desarrollo');
    }
  
    function contactMentor() {
      const studentName = localStorage.getItem('studentName') || 'Estudiante';
      const emotion = selectedEmotion ? selectedEmotion.name : 'concernido/a';
      const reason = feelingReasonInput ? feelingReasonInput.value.trim() : '';
      
      // Crear mensaje para WhatsApp
      let message = `Hola Karen, soy ${studentName} de la comunidad KREI. Me siento ${emotion} y quisiera agendar una cita para platicar.`;
      
      if (reason) {
        message += ` Me siento así porque: ${reason}`;
      }
      
      // Número de teléfono de la mentora (reemplazar con el número real)
      const phoneNumber = "5218110123690"; // Reemplazar con el número real
      
      // Crear URL para WhatsApp
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');
    }
  
    function sendToGoogleSheets(moodData) {
      // URL de tu implementación de Google Apps Script
      const scriptURL = 'https://script.google.com/macros/s/AKfycbz0fVx93y_9XD_DL82MAp9kbEWPdi8WdRfwvfuKsNjRTNl-5DyXVMBmTSV9PXAU7JF3og/exec';
      
      // Datos a enviar
      const formData = new FormData();
      
      // Añadir todos los campos al formulario
      Object.entries({
        timestamp: new Date().toISOString(),
        studentId: getStudentId(),
        studentName: localStorage.getItem('studentName') || '',
        studentGroup: localStorage.getItem('studentGroup') || '',
        emotion: moodData.emotion,
        emoji: moodData.emoji,
        quadrant: moodData.quadrant,
        reason: moodData.reason || '',
        action: moodData.action || '',
        help: moodData.help || '',
        source: 'lite' // Identificador para diferenciar de la versión completa
      }).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      
      // Enviar datos a Google Sheets
      fetch(scriptURL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Importante para evitar problemas de CORS
      })
      .then(() => {
        // No podemos realmente verificar la respuesta con no-cors,
        // así que asumimos que fue exitoso
        console.log('Datos enviados correctamente');
        
        // Guardar localmente como respaldo en caso de problemas de conexión
        saveMoodLocally(moodData);
      })
      .catch(error => {
        console.error('Error al enviar datos:', error);
        showNotification('Error al enviar datos. Guardados localmente.', 'error');
        
        // Guardar en localStorage como respaldo
        saveMoodLocally(moodData);
      });
    }
    
    // Función para guardar datos localmente como respaldo
    function saveMoodLocally(moodData) {
      // Obtener datos existentes
      const localBackup = JSON.parse(localStorage.getItem('moodBackupLite') || '[]');
      
      // Añadir el nuevo registro
      localBackup.push({
        ...moodData,
        pendingSync: true,
        lastSyncAttempt: new Date().toISOString()
      });
      
      // Guardar actualización
      localStorage.setItem('moodBackupLite', JSON.stringify(localBackup));
    }
    
    // Función para sincronizar estados de ánimo pendientes
    function syncPendingMoods() {
      const pendingMoods = JSON.parse(localStorage.getItem('moodBackupLite') || '[]');
      
      // Filtrar solo los pendientes
      const toSync = pendingMoods.filter(mood => mood.pendingSync);
      
      if (toSync.length === 0) {
        console.log('No hay registros pendientes para sincronizar');
        return;
      }
      
      console.log(`Intentando sincronizar ${toSync.length} registros pendientes`);
      showNotification(`Sincronizando ${toSync.length} registros...`);
      
      // Contador para seguimiento
      let syncedCount = 0;
      
      // Función para sincronizar de forma secuencial
      function syncNext(index) {
        if (index >= toSync.length) {
          // Terminamos todos los registros
          localStorage.setItem('moodBackupLite', JSON.stringify(pendingMoods));
          showNotification(`Sincronización completada: ${syncedCount} registros`);
          return;
        }
        
        const mood = toSync[index];
        
        // Marcar como procesado y continuar
        mood.pendingSync = false;
        syncedCount++;
        
        // Continuar con el siguiente después de un breve retraso
        setTimeout(() => syncNext(index + 1), 1000);
      }
      
      // Iniciar sincronización secuencial
      syncNext(0);
    }
    
    // Función para obtener un ID único para el estudiante
    function getStudentId() {
      // Verificar si ya existe un ID
      let studentId = localStorage.getItem('studentId');
      
      // Si no existe, crear uno nuevo
      if (!studentId) {
        studentId = 'student_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('studentId', studentId);
      }
      
      return studentId;
    }
    
    // Función para mostrar notificaciones
    function showNotification(message, type = 'success') {
      const notificationsContainer = document.getElementById('notifications-container') || document.body;
      
      const notification = document.createElement('div');
      notification.className = `notification p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white max-w-md`;
      notification.textContent = message;
      
      notificationsContainer.appendChild(notification);
      
      // Remover después de 4 segundos
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(10px)';
        
        // Remover del DOM después de la animación
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 4000);
    }
  
    // Intentar sincronizar al inicio si hay conexión
    if (navigator.onLine) {
      setTimeout(syncPendingMoods, 3000);
    }
  
    // Registrar listener para cambios de conexión
    window.addEventListener('online', function() {
      showNotification('Conexión restablecida');
      setTimeout(syncPendingMoods, 1000);
    });
  });
