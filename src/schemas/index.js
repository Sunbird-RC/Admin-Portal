import skillCertificate from "./certificate-issuance/schemas/SkillCertificate.json"
import trainingCertificate from "./certificate-issuance/schemas/TrainingCertificate.json"
import baseAttestationField from "./education/schemas/BaseAttestationField.json"
import student from "./education/schemas/Student.json"
import teacher from "./education/schemas/Teacher.json"
import institute from "./education/schemas/Institute.json"

export const getCertificateIssuanceSchemas = () => {
    return {
        skillCertificate,
        trainingCertificate
    }
}
export const getEducationSchemas = () => {
    return {
        baseAttestationField,
        student,
        teacher,
        institute
    }
}

export const getAllReferenceSchemas = () => {
    return {
        "certificate-issuance": getCertificateIssuanceSchemas(),
        "edcation": getEducationSchemas()
    }
}