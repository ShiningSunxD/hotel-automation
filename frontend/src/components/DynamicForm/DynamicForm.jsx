import { useState, useEffect, useMemo } from 'react';
import { TextField, MenuItem, FormControlLabel, Checkbox, Button, TextareaAutosize } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Snackbar_component } from '@components';
import styles from './DynamicForm.module.css'

function DynamicForm({ modelName, API, API_to_update, predefined={}, callBack=null }) {
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [fileData, setFileData] = useState({});
    
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setLoading(false);
        setFormData(predefined);
        const fetchFields = async () => {
        try {
            const params = {
                model: modelName
                }
            const response = await API.get({params});
            console.log('metadata response - ', response.data)
            setFields(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
        };

        fetchFields();
    }, [modelName, predefined.id]);

    const handleInputChange = (e) => {
        console.log(formData);
        console.log(fields);


        const { name, value, type, checked } = e.target;
        if(type === 'number'){
            setFormData((prevData) => ({
            ...prevData,
            [name]: value.replace(/[^\d]/g, ''),
        }));
        }


        if (type === 'checkbox') {
        setFormData((prevData) => ({
            ...prevData,
            [name]: checked,
        }));
    } else {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFileData((prevData) => ({
                ...prevData,
                [name]: files[0] // Сохраняем файл
            }));
        } else {
            // Если файл удален, удаляем его из состояния
            setFileData((prevData) => {
                const newData = { ...prevData };
                delete newData[name];
                return newData;
            });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Проверяем, есть ли файлы для отправки
            const hasFiles = Object.keys(fileData).some(key => fileData[key]);
            
            if(Object.keys(predefined).length !== 0){
                let newData = {}
                fields.map((item) => {
                    newData[item.name] = formData[item.name];
                })
                setFormData(newData);
                    console.log('formData - ', formData)
            }

            console.log('fileData - ', fileData);

            if (hasFiles) {
                // Если есть файлы, используем FormData
                const formDataToSend = new FormData();
                
                // Добавляем обычные данные формы
                Object.keys(formData).forEach(key => {
                    if (formData[key] !== null && formData[key] !== undefined) {
                        // Для дат преобразуем в строку
                        if (formData[key] instanceof dayjs) {
                            formDataToSend.append(key, formData[key].format('YYYY-MM-DD'));
                        } else {
                            formDataToSend.append(key, formData[key]);
                        }
                    }
                });
                
                // Добавляем файлы
                Object.keys(fileData).forEach(key => {
                    if (fileData[key]) {
                        formDataToSend.append(key, fileData[key]);
                    }
                });

                console.log('Отправка FormData:', formDataToSend);

                let response;
                if(Object.keys(predefined).length !== 0){
                    response = await API_to_update.update(predefined.id, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                }
                else{
                    response = await API_to_update.create(formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                }
                
                console.log(response.data);
            } else {


                const jsonDataToSend = formData;

                delete jsonDataToSend['photo'];


                let response;
                if(Object.keys(predefined).length !== 0){
                    response = await API_to_update.update(predefined.id, jsonDataToSend);
                }
                else{
                    console.log('Отправка JSON:', jsonDataToSend);
                    response = await API_to_update.create(jsonDataToSend);
                }
                
                if(response.status == 200 || response.status == 201) {
                    setSuccess(true); 
                    console.log('response.data -', response.data);
                }
                
                else setError(true);
            }
            
            setFormData({}); 
            setFileData({});
            const fileInput = document.getElementById('fileInput');
            if (fileInput) {
                fileInput.value = '';
            }
            callBack && callBack();
        } catch (err) {
            setError(true);
        }
    };



    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <form className={styles.form}>
            <div className={styles.fieldsContainer}>
                {fields.map((field) => {
                    if (field.type === 'datetime') {
                        return null; // Возвращаем null, чтобы ничего не рендерилось
                    }
                return (
                    <div className={styles.fieldContainer} key={field.name}>
                    
                        <label>
                            {field.label}
                            {field.required && <span className="required">*</span>}
                        </label>
                    
                        {field.type === 'select' && (
                            <TextField className={styles.inputField}
                            select
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleInputChange}
                            required={field.required}
                            variant="outlined"
                            label={field.label}
                            >
                            {field.options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                            </TextField>
                        )}
                        {field.type === 'text' && (
                            <TextField className={styles.inputField}
                            type="text"
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleInputChange}
                            required={field.required}
                            placeholder={`Введите ${field.label.toLowerCase()}`}
                            />
                        )}
                        {field.type === 'textarea' && (
                            <TextareaAutosize
                                aria-label="minimum height"
                                name={field.name}
                                value={formData[field.name] || ''}
                                minRows={3}
                                onChange={handleInputChange}
                                required={field.required}
                                placeholder={`Введите ${field.label.toLowerCase()}`}
                            />
                        )}
                        {field.type === 'number' && (

                            <TextField className={styles.inputField}
                                type="number"
                                name={field.name}
                                label={field.label}
                                value={formData[field.name] || ''}
                                onChange={handleInputChange}
                                required={field.required}
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key) && 
                                        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                    }}
                                onPaste={(e) => {
                                    const pasteData = e.clipboardData.getData('text');
                                    const numericPaste = pasteData.replace(/[^\d]/g, '');
                                    if (numericPaste) {
                                        e.target.value = numericPaste
                                    }
                                    e.preventDefault();
                                }}
                            />
                        )}
                        {field.type === 'date' && (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker disablePast 
                                label={field.label}
                                value={formData[field.name] ? dayjs(formData[field.name]) : null}
                                onChange={(newValue) => {
                                        setFormData((prevData) => ({
                                        ...prevData,
                                        [field.name]: dayjs(newValue).format('YYYY-MM-DD'),
                                    }));
                                }}
                                />
                            </LocalizationProvider>
                        )}
                        {field.type === 'positiveintegerfield' && (
                            <TextField className={styles.inputField}
                                type="number"
                                min='0'
                                name={field.name}
                                label={field.label}
                                value={formData[field.name] || ''}
                                onChange={handleInputChange}
                                required={field.required}
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key) && 
                                        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                    }}
                
                                onPaste={(e) => {
                                    const pasteData = e.clipboardData.getData('text');
                                    const numericPaste = pasteData.replace(/[^\d]/g, '');
                                    if (numericPaste) {
                                        e.target.value = numericPaste
                                    }
                                    e.preventDefault();
                                }}
                            />
                        )}
                        {field.type === 'checkbox' && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name={field.name}
                                        checked={formData[field.name] || false}
                                        onChange={handleInputChange}
                                    />
                                }
                            />
                        )}
                        {field.type === 'file' && (
                                <input className={styles.inputField}
                                    id='fileInput'
                                    type="file"
                                    name={field.name}
                                    onChange={handleFileChange}
                                    required={field.required}
                                    accept={".jpg, .jpeg, .png"}
                                        />
                        )}
                        {fileData[field.name] && (
                                    <div style={{ fontSize: '12px', marginTop: '5px' }}>
                                        Выбран файл: {fileData[field.name].name}
                                    </div>
                                )}
                    </div>
                    )})
                }
            </div>
            <Button onClick={handleSubmit} sx={{backgroundColor: 'green'}} variant="contained">
                Сохранить!
            </Button>
            
            <Snackbar_component IsOpen={success} onClose={() => setSuccess(false)} severity='success'>
                Данные успешно сохранены!
            </Snackbar_component>

            <Snackbar_component IsOpen={error} onClose={() => setError(false)} severity='error'>
                Произошла ошибка!
            </Snackbar_component>
        </form>

    );
};

export default DynamicForm;