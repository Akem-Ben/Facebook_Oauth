import { supabase } from "../app";
import {Request, Response} from 'express';
import {v4} from 'uuid';


export const registerUser = async(request:Request, response:Response) => {

    try {
        const { firstName, lastName, email, phone, password } = request.body;
    
        if (!firstName || !lastName || !email || !phone) {
          return response.status(400).json({
            message: "All fields are required"
          });
        }
        // // Define types for findAdmin and findAdminError
        // let findAdmin: HRAdmin | null = null;
        // let findAdminError: PostgrestError | null = null;

        const { data: findAdmin, error: findAdminError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
    
        if (findAdminError && findAdminError.code !== 'PGRST116') {
          // 'PGRST116' is the error code for "no rows returned", ignore it if this is the case
          return response.status(500).json({
            message: "Internal Server Error"
          });
        }
    
        if (findAdmin) {
          return response.status(400).json({
            message: "HR already exists"
          });
        }
    
        const { data: saveAdmin, error: createAdminError } = await supabase
          .from('users')
          .insert({
            id: v4(),
            firstName,
            lastName,
            email,
            phone,
            workEmail: email,
            password,
            isManager: true,
            designation: "HR"
          });
    
        if (createAdminError) {
          return response.status(400).json({
            message: "Unable to create, try again later"
          });
        }
    
        const { data: checkAdmin, error: checkAdminError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
    
        if (checkAdminError || !checkAdmin) {
          return response.status(400).json({
            message: "Unable to create, try again later"
          });
        }
    
        return response.status(200).json({
          message: "Admin Registered",
          checkAdmin,
          admin: {
            firstName: checkAdmin.firstName,
            lastName: checkAdmin.lastName,
            email: checkAdmin.email,
            workEmail: checkAdmin.workEmail,
            phone: checkAdmin.phone,
            designation: checkAdmin.designation
          }
        });
    
      } catch (error: any) {
        console.log(error.message);
        response.status(500).json({
          message: "Internal Server Error"
        });
      }

}