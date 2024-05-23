import { AxiosError, AxiosResponse } from "axios";
import { ref } from "vue"

interface Data<T> extends AxiosResponse<T> {
    ok: boolean;
}

export function useFetchWrapper<T>() {
    const loading = ref(false);
    const error = ref("");
    const data = ref<Data<T>>();

    async function trigger(callback: () => Promise<AxiosResponse<T>>) {
        try {
            // Refresh state on every new request:
            loading.value = true;
            error.value = "";
            data.value = undefined;
            // If OK get the data, otherwise it will throw and data.value will remain undefined:
            const axiosRes = await callback();
            data.value = {
                ...axiosRes,
                ok: (axiosRes.status >= 200 && axiosRes.status <= 299) ? true : false
            }
        }
        catch (err) {
            if (err instanceof AxiosError) {
                // If API response contains a message property in the response body, print that:
                if (err.response?.data.message) {
                    error.value = err.response?.data.message
                } // Otherwise print the standard message from AxiosError
                else error.value = err.message
            }
            else if (err instanceof Error) {
                error.value = err.message;
            }
        }
        finally {
            loading.value = false;
        }
    }

    return { loading, error, data, trigger }
}