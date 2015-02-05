import java.io.*;

class fileMaker{

	public static void main(String[] args){
		for(int i=0;i<=300;i++){
			try{
				OutputStream output = new FileOutputStream("trns.txt");
				if(i<10){
					output=new FileOutputStream("trns_00"+i+".txt");
				}
				else if(i<100){
					output=new FileOutputStream("trns_0"+i+".txt");
				}
				else{
					output=new FileOutputStream("trns_"+i+".txt");
				}
				PrintStream printOut = new PrintStream(output);
				printOut.print("Translation "+i+": nothing to display.");
				System.setOut(printOut);
				System.out.flush();
				printOut.close();
				output.close();
			}
			catch(Exception e){
				System.out.println("Cannot write to file.");
			} 
		}	
	}

}