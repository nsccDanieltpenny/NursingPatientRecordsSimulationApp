import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientCard from '../ui/PatientCard.jsx';



export default function Home() {
    return(
        <>
            <div style={styles.container}>
                <h1>Nursing App Home page</h1>

                <div class="container">
                    <div class="row">
                        <div class="col-sm">
                            <PatientCard />
                            <PatientCard />
                            <PatientCard />
                            <PatientCard />
                            <PatientCard />
                        </div>
                        <div class="col-sm">
                        <PatientCard />
                        <PatientCard />
                        <PatientCard />
                        <PatientCard />
                        <PatientCard />
                        
                        </div>
                        <div class="col-sm">
                        <PatientCard />
                        <PatientCard />
                        <PatientCard />
                        <PatientCard />
                        <PatientCard />
                        </div>
            
                    </div>
                </div>
            </div>
        </>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f8f9fa'
    },
    title: {
        marginBottom: '20px'
    },
    form: {
        width: '300px'
    }
};