import { fetchResumeFile } from "@/requests/requests";
import { useToast } from "@chakra-ui/react";

export default function useFetchResume() {
    const toast = useToast();
    const fetch = async (uuid: string) => {
        try {
            const response = await fetchResumeFile(uuid)
            const fileBlob = new Blob([response.data]);
            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(fileBlob);
            link.download = "cv.pdf";
            link.click();
            link.remove();
        } catch (error) {
            toast({
                title: "Request Error, can't retrieve file at the moment",
                status: "error",
                position: "top-right",
                duration: 6000,
                isClosable: true,
            });
        }
    }
    return fetch
}