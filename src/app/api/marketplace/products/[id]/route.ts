import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Product fetch error:", error);
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Fetch owner profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, first_name, last_name, farm_name")
      .eq("id", product.owner_id)
      .single();

    const productWithProfile = {
      ...product,
      profiles: profile || null,
    };

    return NextResponse.json({ success: true, product: productWithProfile });
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
