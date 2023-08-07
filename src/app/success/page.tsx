import { NextPage } from "next";
import React from "react";
import Button from "@/components/Button/Button";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prismaClient";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { data } from "autoprefixer";

type SuccessProps = {
  searchParams: {
    day: string;
    time: string;
    service: string;
    session_id: string;
    day_week: string;
    user_id: string;
    month: string;
    year: string;
    userNumber: string;
    price: string;
    token: string;
  };
};

// Function to validate the single-use JWT
function validateSingleUseToken(
  token: string
): { createdAt: Date; id: string } | null {
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { [key: string]: any };
    return { createdAt: decodedToken.createdAt, id: decodedToken.id };
  } catch (err) {
    return null;
  }
}

const Success: NextPage<SuccessProps> = async ({ searchParams }) => {
  const {
    day,
    day_week,
    month,
    service,
    session_id,
    time,
    year,
    price,
    token,
  } = searchParams;

  if (
    !day ||
    !day_week ||
    !month ||
    !service ||
    !session_id ||
    !time ||
    !year ||
    !price
  ) {
    redirect(`${process.env.APP_URL}/?error=Fields not provided`);
  }

  const findToken = await prisma.tokens.findFirst({
    where: {
      id: validateSingleUseToken(token)?.id,
    },
  });





  if (findToken?.invalid) {
    redirect(`${process.env.APP_URL}`);
  } else {
    try {
      await prisma.tokens.update({
        where: {
          id: validateSingleUseToken(token)?.id,
        },
        data: { invalid: true },
      });
      console.log("Recuperando a sessão do Stripe ...");
      const session = await stripe.checkout.sessions.retrieve(session_id);

      const userExists = await prisma.clientes.findFirst({
        where: {
          telefone: session.customer_details?.phone as string,
        },
      });

      if (!userExists) {
        console.log("Criando novo usuário ...");
        const newUser = await prisma.clientes.create({
            data: {
                telefone: session.customer_details?.phone as string,
                email: session.customer_details?.email as string,
                nome: session.customer_details?.name as string,
                v: 0,
            },
        });
        console.log("Usuário criado com sucesso!");
    
        // Agora, criamos uma reserva para o usuário recém-criado.
        console.log("Criando reserva para novo usuário ...");
        const bookingCreated = await prisma.booking.create({
            data: {
                selectedDate: Number(day),
                selectedDayOfWeek: day_week,
                selectedMonth: month,
                selectedTime: time,
                selectedYear: Number(year),
                selectedProductDefaultPrice: Number(price),
                cliente: {
                    connect: {
                        telefone: session.customer_details?.phone as string,
                    },
                },
            },
        });
        if (bookingCreated) {
            console.log("Reserva criada com sucesso!");
        } else {
            console.log("Falha ao criar a reserva.");
        }
    }



    
      if (userExists && userExists.email) {
        console.log("Criando reserva para usuário com email existente ...");
        const bookingCreated = await prisma.booking.create({
          data: {
            selectedDate: Number(day),
            selectedDayOfWeek: day_week,
            selectedMonth: month,
            selectedTime: time,
            selectedYear: Number(year),
            selectedProductDefaultPrice: Number(price),
            cliente: {
              connect: {
                telefone: session.customer_details?.phone as string,
              },
            },
          },
        });
        console.log("Reserva criada com sucesso!");
        if (bookingCreated) {
          console.log(searchParams)
          //console.log("Send email to " + userExists.email);
        }
      }
    } catch (error: any) {
      console.error("Erro ao criar usuário ou reserva:", error);
      redirect(`${process.env.APP_URL}/?error=${error.message}`);
    }
  }

  return (
    <main className="flex min-h-screen justify-center p-10">
      <div className="w-full max-w-lg flex items-center flex-col">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 256 256"
          className="fill-green-600"
        >
          <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
        </svg>
        <span className="text-green-600 font-semibold mt-2">
          Booking Confirmed!
        </span>
        <span className="mt-1 font-bold">
          {service} {day_week} {day} {month} {searchParams.time}
        </span>
        <a href="/" className="mt-3 w-full">
          <Button isLoading={false} type="button">
            Go Back
          </Button>
        </a>
      </div>
    </main>
  );
};

export default Success;
