import { useState } from 'react';

/**
 * Hook personalizado para validación de formularios
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Function} validate - Función de validación que recibe los valores y devuelve errores
 * @returns {Object} - Objeto con valores, errores, funciones de manejo y validación
 */
export const useFormValidation = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  // Validación en tiempo real al cambiar un campo
  const handleBlur = (e) => {
    const { name } = e.target;
    const validationErrors = validate({ ...values });
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name]
    }));
  };

  // Validación completa al enviar el formulario
  const handleSubmit = (callback) => async (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setIsSubmitting(true);
    
    // Si no hay errores, ejecuta el callback
    const errorValues = Object.values(validationErrors);
    if (errorValues.length === 0 || errorValues.every(x => x === '')) {
      await callback();
    }
    
    setIsSubmitting(false);
  };

  // Resetear el formulario
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors
  };
};