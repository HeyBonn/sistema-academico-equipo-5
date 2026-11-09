import  {Component, inject} from '@angular/core';
import { Estudiante } from './models/estudiante';
//nuevas importaciones:
import { FormsModule } from '@angular/forms';
import { EstudianteService } from './services/estudiantes';

@Component ({
  selector: 'app-root',
  imports: [FormsModule],//añadimos el formsModule
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  titulo : string = "Sistemas de Gestion Academica";
  //modificamos todo el codigo que estaba acá
  private estudianteService = inject(EstudianteService);
  estudiantes = this.estudianteService.obtenerEstudiantes();
  // Texto utilizado para filtrar la lista de estudiantes.
  textoBusquedam = '';

  // Añadir en la clase App:
idEditando: number | null = null;
  
  nuevoEstudiante: Estudiante = { id: 0, nombre: '', correo: '', carrera: '', telefono: '' };

  guardarEstudiante() {
    if (this.nuevoEstudiante.id === 0) {
      this.estudianteService.agregarEstudiante({ ...this.nuevoEstudiante });
    } else {
      this.estudianteService.actualizarEstudiante(this.nuevoEstudiante);
    }
    this.limpiarFormulario();
  }

  seleccionarParaEditar(estudiante: Estudiante) {
  this.nuevoEstudiante = { ...estudiante };
  this.idEditando = estudiante.id; // Asignar ID al seleccionar
}

  eliminar(id: number) {
    const seguro = confirm('¿Estás seguro de que deseas eliminar este estudiante?');
    if (seguro) {
      this.estudianteService.eliminarEstudiante(id);
    }
  }

  // Comprueba si algún dato del estudiante coincide con la búsqueda.
  coincideBusqueda(estudiante: Estudiante): boolean {
    const texto = this.textoBusquedam.trim().toLowerCase();
    return [estudiante.nombre, estudiante.correo, estudiante.carrera, estudiante.telefono]
      .some(dato => dato.toLowerCase().includes(texto));
  }

  get hayCoincidencias(): boolean {
    return this.estudiantes.some(estudiante => this.coincideBusqueda(estudiante));
  }

  // Limpia la lista desde el servicio y reinicia la búsqueda y el formulario.
  limpiarLista() {
    const seguro = confirm('¿Estás seguro de que deseas limpiar la lista de estudiantes?');
    if (seguro) {
      this.estudianteService.limpiarEstudiante();
      this.textoBusquedam = '';
      this.limpiarFormulario();
    }
  }

  limpiarFormulario() {
  this.nuevoEstudiante = { id: 0, nombre: '', correo: '', carrera: '', telefono: '' };
  this.idEditando = null; // Reiniciar al limpiar
}
}