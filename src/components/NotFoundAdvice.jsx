import React from "react";
import DOMPurify from "dompurify";

export default function NotFoundAdvice() {
    const errorMessage = "Errore: pagina non trovata";
    const sanitizedMessage = DOMPurify.sanitize(errorMessage);

    return (
        <div className=" md:bg-transparent md:flex md:flex-col md:min-h-screen md:justify-center md:align-middle flex flex-col min-h-screen justify-center align-middle">
            <p className="text-center text-xl" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
        </div>
    );
}
