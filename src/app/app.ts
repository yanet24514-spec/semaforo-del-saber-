
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_AUTH_DOMAIN',
  projectId: 'educacion-progreso',
  storageBucket: 'TU_STORAGE_BUCKET',
  messagingSenderId: 'TU_MESSAGING_SENDER_ID',
  appId: 'TU_APP_ID'
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {

  entendieron = 0;
  dudas = 0;
  necesitanAyuda = 0;

  total = 0;

  porcentajeVerde = 0;
  porcentajeAmarillo = 0;
  porcentajeRojo = 0;

  private unsubscribe: (() => void) | undefined;

  ngOnInit(): void {
    const respuestasRef = collection(db, 'respuestas');

    this.unsubscribe = onSnapshot(respuestasRef, (snapshot) => {

      this.entendieron = 0;
      this.dudas = 0;
      this.necesitanAyuda = 0;

      snapshot.forEach((documento) => {
        const respuesta = documento.data()['respuesta'];

        if (respuesta === 'verde') {
          this.entendieron++;
        } else if (respuesta === 'amarillo') {
          this.dudas++;
        } else if (respuesta === 'rojo') {
          this.necesitanAyuda++;
        }
      });

      this.total =
        this.entendieron + this.dudas + this.necesitanAyuda;

      this.porcentajeVerde = this.total
        ? Math.round(this.entendieron * 100 / this.total) : 0;

      this.porcentajeAmarillo = this.total
        ? Math.round(this.dudas * 100 / this.total) : 0;

      this.porcentajeRojo = this.total
        ? Math.round(this.necesitanAyuda * 100 / this.total) : 0;

    });
  }

  ngOnDestroy(): void {
    this.unsubscribe?.();
  }
}
